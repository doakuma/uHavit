from __future__ import annotations

import argparse
import os
from dataclasses import dataclass
from datetime import date

from uhavit.infrastructure.sqlite_db import SqliteDb
from uhavit.infrastructure.sqlite_habit_repository import SqliteHabitRepository
from uhavit.application.use_cases import (
    CoachTodayMessage,
    CreateHabit,
    GetStatus,
    LogCheckIn,
)
from uhavit.infrastructure.system_clock import SystemClock
from uhavit.infrastructure.simple_coach import SimpleCoach


@dataclass(frozen=True)
class AppWiring:
    db: SqliteDb
    habits: SqliteHabitRepository
    clock: SystemClock
    coach: SimpleCoach


def _default_db_path() -> str:
    return os.environ.get("UHAVIT_DB_PATH", os.path.join(os.getcwd(), "uhavit.db"))


def _wire(db_path: str) -> AppWiring:
    db = SqliteDb(db_path=db_path)
    db.migrate()
    return AppWiring(
        db=db,
        habits=SqliteHabitRepository(db),
        clock=SystemClock(),
        coach=SimpleCoach(),
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="uhavit")
    parser.add_argument("--db", default=_default_db_path(), help="SQLite DB path")

    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("init", help="Initialize DB (idempotent)")

    p_add = sub.add_parser("add-habit", help="Create a new habit")
    p_add.add_argument("name", help="Habit name")

    p_check = sub.add_parser("checkin", help="Log today check-in")
    p_check.add_argument("habit_id", help="Habit id")
    p_check.add_argument("--on", dest="on", default=None, help="YYYY-MM-DD (optional)")

    sub.add_parser("status", help="Show habits + streaks")
    sub.add_parser("coach", help="Generate today's coach message")

    args = parser.parse_args(argv)
    app = _wire(args.db)

    if args.cmd == "init":
        # wiring already migrates
        print(f"OK: initialized {args.db}")
        return 0

    if args.cmd == "add-habit":
        habit_id = CreateHabit(app.habits, clock=app.clock).execute(name=args.name)
        print(habit_id)
        return 0

    if args.cmd == "checkin":
        on: date | None
        if args.on is None:
            on = None
        else:
            on = date.fromisoformat(args.on)
        LogCheckIn(app.habits, clock=app.clock).execute(habit_id=args.habit_id, on=on)
        print("OK")
        return 0

    if args.cmd == "status":
        status = GetStatus(app.habits, clock=app.clock).execute()
        for row in status:
            print(
                f"{row.habit_id} | {row.name} | streak={row.streak_days} | last={row.last_check_in}"
            )
        return 0

    if args.cmd == "coach":
        msg = CoachTodayMessage(
            habit_repo=app.habits, coach=app.coach, clock=app.clock
        ).execute()
        print(msg)
        return 0

    raise AssertionError(f"Unhandled cmd: {args.cmd}")

