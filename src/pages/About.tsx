
import { MainLayout } from "@/components/layout/MainLayout";

const About = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-elder-2xl font-bold text-center text-elder-dark mb-8">About Elder Voice Link</h1>
        
        <section className="mb-10 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-elder-xl font-bold text-elder-dark mb-4">Our Mission</h2>
          <p className="text-elder-lg text-elder-text mb-6">
            Elder Voice Link is dedicated to improving the lives of older adults by providing an accessible voice assistant 
            technology that helps them stay connected with their families and manage daily tasks with ease.
          </p>
          <p className="text-elder-lg text-elder-text">
            We believe that technology should be accessible to everyone, regardless of age or technical ability. 
            Our voice assistant is designed with simplicity and clarity in mind, making it easy for older adults 
            to use without requiring extensive training or technical knowledge.
          </p>
        </section>
        
        <section className="mb-10 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-elder-xl font-bold text-elder-dark mb-4">How It Works</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-elder-lg font-bold text-elder-dark mb-2">For Older Adults</h3>
              <p className="text-elder-base text-elder-text">
                Simply speak to the assistant using natural language. You can send messages, set reminders, 
                check your calendar, and more - all with simple voice commands.
              </p>
            </div>
            
            <div>
              <h3 className="text-elder-lg font-bold text-elder-dark mb-2">For Family Members</h3>
              <p className="text-elder-base text-elder-text">
                Family members can use the Family Portal to manage settings, add important information, 
                set up reminders, and monitor the well-being of their loved ones.
              </p>
            </div>
          </div>
        </section>
        
        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-elder-xl font-bold text-elder-dark mb-4">Contact Us</h2>
          <p className="text-elder-lg text-elder-text mb-6">
            If you have any questions or need support with Elder Voice Link, please don't hesitate to contact us.
          </p>
          <div className="text-elder-lg">
            <p className="mb-2"><strong>Email:</strong> contact@eldervoicelink.com</p>
            <p className="mb-2"><strong>Phone:</strong> (555) 123-4567</p>
            <p><strong>Hours:</strong> Monday to Friday, 9am to 5pm EST</p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default About;
