export type createAssessmentType = {
  teamId: string;
  nameAssessment: string;
  startDate: string;
  endDate: string;
  criteriaList: string[];
  memberIds: string[];
  assessmentId?: string;
};

export enum filterOfGetAssessmentList {
  NAME,
  DATE,
  STATUS,
}

export enum sortType {
  ASC = 'asc',
  DESC = 'desc',
}

export type getAssessmentListType = {
  teamId: string;
  orderBy: filterOfGetAssessmentList;
  sort: sortType;
  isGettingAll: boolean;
  search?: string;
  offSet: number;
  limit: number;
};

export type getAssessmentArgs = {
  teamId: string;
  assessmentId: string;
};

export type submitDoPersonalReflection = {
  teamId: string;
  assessmentId: string;
  assessorId: string;
  memberAnswer: {
    isDone: boolean;
    concerningMemberId: string;
    data: {
      assessmentOnCriteriaId: string;
      point: number;
      comment: string;
    }[];
  }[];
};
