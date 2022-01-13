import { gql } from '@apollo/client';
export const BOARD_FIELDS = gql`
  fragment BoardFields on Board {
    id
    teamId
    createdAt
    updatedAt
    createdBy
    isPublic
    isLocked
    disableDownVote
    disableUpVote
    isAnonymous
    votesLimit
    title
    timerInProgress
    endTime
    columns {
      id
      color
      title
      isActive
      opinions {
        id
        columnId
        authorId
        createdAt
        updatedAt
        text
        upVote
        downVote
        updatedBy
        isAction
        isBookmarked
        responsible
        mergedAuthors
        status
        color
        author {
          id
          email
          createdAt
          updatedAt
          isAdmin
          userStatus
          profile {
            id
            userId
            name
            nickname
            picture
          }
        }
        position
        remarks {
          id
          authorId
          opinionId
          text
          createdAt
          updatedAt
        }
      }
      boardId
    }
    team {
      id
      name
      createdAt
      ownerUserIds
      startDate
      endDate
      picture
      numOfMember
      isPublic
      status
      description
      members {
        id
        userId
        teamId
        isOwner
        isPendingInvitation
        isGuess
        invitedBy
        joinedAt
        role
        user {
          id
          email
          createdAt
          isAdmin
          updatedAt
          userStatus
          profile {
            id
            userId
            name
            nickname
            picture
          }
        }
      }
      boards {
        id
        title
        isPublic
        isLocked
        createdAt
        updatedAt
        disableDownVote
        disableUpVote
      }
    }
  }
`;
