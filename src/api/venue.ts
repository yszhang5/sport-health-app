import service from '@/utils/request';
import type { Result } from '@/utils/request';
import type { VenueVO, VenueSearchParams } from './model/venueModel';

enum Api {
    List = '/venues/list',
    Detail = '/venues',
}

export const getVenueListApi = (params?: VenueSearchParams) => {
    return service.get<any, Result<VenueVO[]>>(Api.List, { params });
};

export const getVenueDetailApi = (venueId: number) => {
    return service.get<any, Result<VenueVO>>(`${Api.Detail}/${venueId}`);
};

