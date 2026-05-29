'use strict';

const { generateRaceIds } = require('./race-id-generator');

class ListRaceIdsUseCase {
  constructor({ raceIdRepository, output = console.log, logger = console }) {
    this.raceIdRepository = raceIdRepository;
    this.output = output;
    this.logger = logger;
  }

  async execute({ ymd }) {
    await this.raceIdRepository.connect();

    try {
      const raceCounts = await this.raceIdRepository.findRaceCountsByYmd(ymd);

      if (raceCounts.length === 0) {
        this.logger.error(`(warn) race_count_by_date に ${ymd} のデータがありません。`);
        return { raceIds: [], count: 0 };
      }

      const raceIds = generateRaceIds({ ymd, raceCounts });
      for (const raceId of raceIds) this.output(raceId);
      return { raceIds, count: raceIds.length };
    } finally {
      try { await this.raceIdRepository.close(); } catch { /* ignore */ }
    }
  }
}

module.exports = { ListRaceIdsUseCase };
