
import { MainLayout } from "@/components/layout/MainLayout";
import { ElderButton } from "@/components/ui/elder-button";

const Family = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-elder-2xl font-bold text-center text-elder-dark mb-8">Family Portal</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-elder-xl font-bold text-elder-dark mb-6">Login to Family Portal</h2>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-elder-lg font-medium text-elder-dark mb-2">Email</label>
              <input
                id="email"
                type="email"
                className="w-full p-4 text-elder-lg border-2 border-elder-gray rounded-md focus:outline-none focus:border-elder-primary"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-elder-lg font-medium text-elder-dark mb-2">Password</label>
              <input
                id="password"
                type="password"
                className="w-full p-4 text-elder-lg border-2 border-elder-gray rounded-md focus:outline-none focus:border-elder-primary"
                placeholder="Enter your password"
              />
            </div>
            
            <div>
              <ElderButton type="button" size="default" className="w-full">
                Login
              </ElderButton>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <a href="#" className="text-elder-lg text-elder-primary hover:underline">
              Forgot your password?
            </a>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-elder-xl font-bold text-elder-dark mb-4">New to Elder Voice Link?</h2>
          <p className="text-elder-lg text-elder-text mb-6">
            Create an account to manage settings for your loved ones, set up reminders, 
            and stay connected through our voice assistant platform.
          </p>
          <ElderButton variant="outline" size="default" className="w-full">
            Create an Account
          </ElderButton>
        </div>
      </div>
    </MainLayout>
  );
};

export default Family;
