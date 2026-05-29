'use strict';

const { countRaceDayEntries } = require('./race-days');

class SaveMonthlyCalendarUseCase {
  constructor({ calendarClient, calendarParser, calendarRepository, logger = console }) {
    this.calendarClient = calendarClient;
    this.calendarParser = calendarParser;
    this.calendarRepository = calendarRepository;
    this.logger = logger;
  }

  async execute({ year, month }) {
    const html = await this.calendarClient.fetchMonthlyCalendar({ year, month });
    const raceDays = this.calendarParser.parse(html, { year, month });
    const totalEntries = countRaceDayEntries(raceDays);

    this.logger.log(`[INFO] 開催日: ${raceDays.size}日、会場-日組み合わせ: ${totalEntries}件`);

    if (totalEntries === 0) {
      this.logger.log('[INFO] 開催情報なし。終了。');
      return { raceDays, totalEntries, savedRows: 0 };
    }

    const savedRows = await this.calendarRepository.saveRaceDays(raceDays);
    return { raceDays, totalEntries, savedRows };
  }
}

module.exports = { SaveMonthlyCalendarUseCase };
