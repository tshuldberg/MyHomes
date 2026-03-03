import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

const devAuthState = vi.hoisted(() => ({
  isLoaded: true,
  isSignedIn: true,
  user: {
    firstName: 'Admin',
    fullName: 'Admin User',
    imageUrl: null,
    primaryEmailAddress: { emailAddress: 'admin@humanhomes.dev' },
  },
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('@/lib/dev-auth', () => ({
  useDevAuth: () => devAuthState,
}));

import HomePage from '../src/app/page';
import AppLayout from '../src/app/(app)/layout';
import DiscoverPage from '../src/app/(app)/discover/page';
import DevLoginPage from '../src/app/dev-login/page';
import SellPage from '../src/app/(app)/sell/page';
import ProfileClient from '../src/app/(app)/profile/profile-client';
import AboutPage from '../src/app/about/page';
import HowItWorksPage from '../src/app/how-it-works/page';
import PrivacyPage from '../src/app/privacy/page';
import TermsPage from '../src/app/terms/page';
import SignInPage from '../src/app/sign-in/[[...sign-in]]/page';
import SignUpPage from '../src/app/sign-up/[[...sign-up]]/page';

describe('HumanHomes web: full page/button behavior coverage', () => {
  beforeEach(() => {
    const router = (globalThis as {
      __HH_ROUTER__: {
        push: ReturnType<typeof vi.fn>;
        replace: ReturnType<typeof vi.fn>;
        back: ReturnType<typeof vi.fn>;
      };
    }).__HH_ROUTER__;
    const nav = (globalThis as {
      __HH_NAV_STATE__: { pathname: string; searchParams: URLSearchParams };
    }).__HH_NAV_STATE__;

    router.push.mockReset();
    router.replace.mockReset();
    router.back.mockReset();

    nav.pathname = '/discover';
    nav.searchParams = new URLSearchParams();

    devAuthState.isLoaded = true;
    devAuthState.isSignedIn = true;
    devAuthState.signIn.mockReset();
    devAuthState.signOut.mockReset();
  });

  it('renders landing page with all primary and footer navigation actions', () => {
    render(<HomePage />);

    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '/sign-in');
    expect(screen.getByRole('link', { name: 'Join' })).toHaveAttribute('href', '/sign-up');
    expect(screen.getByRole('link', { name: 'Discover Homes' })).toHaveAttribute('href', '/discover');
    expect(screen.getByRole('link', { name: 'List Your Home' })).toHaveAttribute('href', '/discover');
    expect(screen.getByRole('link', { name: 'Join the Community' })).toHaveAttribute('href', '/sign-up');

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'How It Works' })).toHaveAttribute('href', '/how-it-works');
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
  });

  it('toggles discover preferences and filters visible neighborhood cards', () => {
    render(<DiscoverPage />);

    expect(screen.getByText('Temescal')).toBeInTheDocument();
    expect(screen.getByText('Sellwood')).toBeInTheDocument();
    expect(screen.getByText('Bernal Heights')).toBeInTheDocument();
    expect(screen.getByText('Montrose')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore neighborhood: Temescal' })).toHaveAttribute(
      'href',
      '/discover/temescal',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Diverse community' }));

    expect(screen.queryByText('Temescal')).not.toBeInTheDocument();
    expect(screen.queryByText('Sellwood')).not.toBeInTheDocument();
    expect(screen.getByText('Bernal Heights')).toBeInTheDocument();
    expect(screen.getByText('Montrose')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Diverse community' }));

    expect(screen.getByText('Temescal')).toBeInTheDocument();
    expect(screen.getByText('Sellwood')).toBeInTheDocument();
  });

  it('shows no-match messaging when selected preferences filter out all neighborhoods', () => {
    render(<DiscoverPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Yard space' }));

    expect(
      screen.getByText('No neighborhoods match all selected preferences yet.'),
    ).toBeInTheDocument();
  });

  it('renders app layout nav links and signs out through the user action', () => {
    const router = (globalThis as { __HH_ROUTER__: { push: ReturnType<typeof vi.fn> } }).__HH_ROUTER__;

    render(
      <AppLayout>
        <div>child content</div>
      </AppLayout>,
    );

    expect(screen.getAllByRole('link', { name: 'Discover' })[0]).toHaveAttribute('href', '/discover');
    expect(screen.getAllByRole('link', { name: 'Messages' })[0]).toHaveAttribute('href', '/messages');
    expect(screen.getAllByRole('link', { name: 'Profile' })[0]).toHaveAttribute('href', '/profile');
    expect(screen.getByRole('link', { name: 'Sell Your Home' })).toHaveAttribute('href', '/sell');

    fireEvent.click(screen.getByRole('button', { name: /Sign Out/ }));

    expect(devAuthState.signOut).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith('/');
  });

  it('routes dev login success to the requested redirect target', () => {
    const router = (globalThis as { __HH_ROUTER__: { push: ReturnType<typeof vi.fn> } }).__HH_ROUTER__;
    const nav = (globalThis as {
      __HH_NAV_STATE__: { pathname: string; searchParams: URLSearchParams };
    }).__HH_NAV_STATE__;

    nav.searchParams = new URLSearchParams('redirect=/messages');
    devAuthState.signIn.mockReturnValue(true);

    render(<DevLoginPage />);

    const adminInputs = screen.getAllByPlaceholderText('admin');
    fireEvent.change(adminInputs[0], { target: { value: 'admin' } });
    fireEvent.change(adminInputs[1], { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(devAuthState.signIn).toHaveBeenCalledWith('admin', 'admin');
    expect(router.push).toHaveBeenCalledWith('/messages');
  });

  it('routes sell call-to-action button to the profile page', () => {
    render(<SellPage />);

    expect(screen.getByRole('link', { name: 'Start Your Listing' })).toHaveAttribute('href', '/profile');
  });

  it('saves profile story and shows user feedback from the save action', () => {
    render(<ProfileClient />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'We are looking for a neighborhood with a strong community.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save Profile' }));

    expect(screen.getByRole('status')).toHaveTextContent('Profile saved locally.');
  });

  it('keeps static policy pages connected to home navigation', () => {
    const about = render(<AboutPage />);
    expect(screen.getByRole('link', { name: 'HumanHomes' })).toHaveAttribute('href', '/');
    about.unmount();

    const howItWorks = render(<HowItWorksPage />);
    expect(screen.getByRole('link', { name: 'HumanHomes' })).toHaveAttribute('href', '/');
    howItWorks.unmount();

    const privacy = render(<PrivacyPage />);
    expect(screen.getByRole('link', { name: 'HumanHomes' })).toHaveAttribute('href', '/');
    privacy.unmount();

    const terms = render(<TermsPage />);
    expect(screen.getByRole('link', { name: 'HumanHomes' })).toHaveAttribute('href', '/');
    terms.unmount();
  });

  it('renders sign-in and sign-up pages with Clerk interfaces', () => {
    const signIn = render(<SignInPage />);
    expect(screen.getByRole('link', { name: 'HumanHomes' })).toHaveAttribute('href', '/');
    expect(screen.getByText('SignIn Component')).toBeInTheDocument();
    signIn.unmount();

    render(<SignUpPage />);
    expect(screen.getByRole('link', { name: 'HumanHomes' })).toHaveAttribute('href', '/');
    expect(screen.getByText('SignUp Component')).toBeInTheDocument();
  });
});
