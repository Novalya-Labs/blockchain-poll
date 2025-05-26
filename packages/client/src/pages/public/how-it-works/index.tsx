export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="font-gendy text-4xl font-medium mb-4">How It Works</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn about our platform and how we help connect citizens with their local administration
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-border">
            <div className="mb-4 text-primary">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <title>Create an Account</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Create an Account</h3>
            <p className="text-muted-foreground">
              Sign up as a citizen or administrator to access the platform's features
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border">
            <div className="mb-4 text-primary">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <title>Submit Requests</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Submit Requests</h3>
            <p className="text-muted-foreground">Citizens can easily submit and track their administrative requests</p>
          </div>

          <div className="p-6 rounded-xl border border-border">
            <div className="mb-4 text-primary">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <title>Get Updates</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Get Updates</h3>
            <p className="text-muted-foreground">
              Receive real-time updates and notifications about your requests' status
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-medium mb-8">Ready to get started?</h2>
          <button
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors"
            type="button"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};
