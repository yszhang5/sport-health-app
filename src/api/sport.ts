import service from '@/utils/request';
import type { Result } from '@/utils/request';
import type { SportRecordParams, SportRecordVO, RankVO } from './model/sportModel';

enum Api {
    Record = '/sports/record',
    History = '/sports/history',
    RankSteps = '/sports/rank/steps',
}

export const uploadSportRecordApi = (params: SportRecordParams) => {
    return service.post<any, Result<number>>(Api.Record, params);
};

export const getSportHistoryApi = () => {
    return service.get<any, Result<SportRecordVO[]>>(Api.History);
};

export const getStepRankApi = () => {
    return service.get<any, Result<RankVO[]>>(Api.RankSteps);
};