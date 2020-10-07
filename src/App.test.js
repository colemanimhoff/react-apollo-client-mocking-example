import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { mount } from 'enzyme';
import { spy } from 'sinon';

import App, {
  Star,
  STAR_REPOSITORY,
  GET_REPOSITORIES_OF_ORGANIZATION,
} from './App';
import mockedApolloClient from './test/mockedApolloClient';
import './test/setup';

describe('Star', () => {
  it('calls the mutate method on Apollo Client', () => {
    spy(mockedApolloClient, 'mutate');

    const wrapper = mount(
      <ApolloProvider client={mockedApolloClient}>
        <Star id={'1'} />
      </ApolloProvider>
    );

    wrapper.find('button').simulate('click');
    expect(mockedApolloClient.mutate.calledOnce).toEqual(true);
    expect(mockedApolloClient.mutate.getCall(0).args[0].variables).toEqual({
      id: '1',
    });
    expect(mockedApolloClient.mutate.getCall(0).args[0].mutation).toEqual(
      STAR_REPOSITORY,
    );
    mockedApolloClient.mutate.restore();
  });

  describe('App', () => {
    it('calls the query method on Apollo Client', () => {
      spy(mockedApolloClient, 'watchQuery');

      const wrapper = mount(
        <ApolloProvider client={mockedApolloClient}>
          <App />
        </ApolloProvider>,
      );

      expect(mockedApolloClient.watchQuery.calledOnce).toEqual(true);
      expect(mockedApolloClient.watchQuery.getCall(0).args[0].query).toEqual(
        GET_REPOSITORIES_OF_ORGANIZATION,
      );

    });

    it('renders correctly after the query method on Apollo Client executed', () => {
      const wrapper = mount(
        <ApolloProvider client={mockedApolloClient}>
          <App />
        </ApolloProvider>,
      );
      expect(
        wrapper
          .find('Repositories')
          .find('RepositoryList')
          .find('li').length,
      ).toEqual(2);
      expect(
        wrapper.find('Repositories').props().repositories.edges[0].node
          .id,
      ).toEqual('1');
      expect(
        wrapper.find('Repositories').props().repositories.edges[1].node
          .id,
      ).toEqual('2');
    });
  });
});
