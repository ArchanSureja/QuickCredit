import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl font-bold mb-4">Account Aggregator MSME Lending Platform</h1>
        <p className="text-xl text-gray-600 mb-8">
          Access the admin panel to manage loan applications, criteria, and view analytics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/admin">
              Go to Admin Dashboard
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login">
              Admin Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
