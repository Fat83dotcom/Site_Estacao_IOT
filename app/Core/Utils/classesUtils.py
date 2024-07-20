import datetime
from datetime import timedelta
from django.utils import timezone


class TimeUtils:
    @classmethod
    def timeNow(self) -> datetime:
        return timezone.localtime()

    @classmethod
    def timeLast(self, hoursAgo) -> datetime:
        return self.timeNow() - timedelta(hours=hoursAgo)
