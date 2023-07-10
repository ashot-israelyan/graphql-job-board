import { ApolloClient, ApolloLink, concat, createHttpLink, gql, InMemoryCache } from '@apollo/client';
import { API_URL, getAccessToken } from '../auth';

const httpLink = createHttpLink({ uri: `${API_URL}/graphql` });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
  }

  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

export async function createJob({ title, description }) {
  const mutation = gql`
      mutation CreateAJob($input: CreateJobInput!) {
          job: createJob(input: $input) {
              id
          }
      }
  `;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { input: { title, description } }
  });

  return data.job;
}

export async function getCompany(id) {
  const query = gql`
      query CompanyById($id: ID!) {
          company(id: $id) {
              id
              name
              description
              jobs {
                  id
                  date
                  title
              }
          }
      }
  `;

  const { data } = await apolloClient.query({
    query,
    variables: { id }
  });

  return data.company;
}

export async function getJob(id) {
  const query = gql`
      query JobById($id: ID!) {
          job(id: $id) {
              id
              date
              title
              company {
                  id
                  name
              }
              description
          }
      }
  `;

  const { data } = await apolloClient.query({
    query,
    variables: { id }
  });

  return data.job;
}

export async function getJobs() {
  const query = gql`
      query Jobs {
          jobs {
              id
              date
              title
              company {
                  id
                  name
              }
          }
      }
  `;

  const result = await apolloClient.query({ query });

  return result.data.jobs;
}
