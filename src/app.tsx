import { Layout } from '@components';
import { useGlobal } from '@contexts';
import { ChangingPage, FeedingPage, GrowthPage, HomePage, LandingPage, NotesPage, ProfilePage, SleepPage, TrendsPage } from '@pages';
import { Page } from '@types';

export const App = () => {
  const { page } = useGlobal();

  const getPage = () => {
    switch (page) {
      case Page.CHANGING: return <ChangingPage />;
      case Page.FEEDING: return <FeedingPage />;
      case Page.GROWTH: return <GrowthPage />;
      case Page.HOME: return <HomePage />;
      case Page.LANDING: return <LandingPage />;
      case Page.NOTES: return <NotesPage />;
      case Page.PROFILE: return <ProfilePage />;
      case Page.SLEEP: return <SleepPage />;
      case Page.TRENDS: return <TrendsPage />;
    }
  };

  return page === Page.LANDING
    ? getPage()
    : (
      <Layout>
        {getPage()}
      </Layout>
    );
};
