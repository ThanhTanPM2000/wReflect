import { gql } from '@apollo/client'

const getTeams = gql`
   query getTeams {
        teams {
            data {
                name
                description
                picture
            }
        }
   }
`

export {getTeams}