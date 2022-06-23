const PrivacyPolicy = () => {
  return (
    <div className="bg-white mt-16 mx-1 md:mx-16 rounded-md shadow-sm shadow-black font-gothic text-text-primary">
      <div className="mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
        <div className="flex flex-col w-full font-gothic space-y-3 px-2 sm:px-10">
          <h1 className="text-2xl sm:text-4xl">Privacy Policy</h1>
          <p className="text-sm sm:text-base">
            When visitors leave comments on the site we collect the data shown
            in the comments form, and also the visitor’s IP address and browser
            user agent string to help spam detection.
          </p>
          <h1 className="text-lg sm:text-xl">Media</h1>
          <p className="text-sm sm:text-base">
            If you upload images to the website, you should avoid uploading
            images with embedded location data (EXIF GPS) included. Visitors to
            the website can download and extract any location data from images
            on the website.
          </p>
          <h1 className="text-lg sm:text-xl">Cookies</h1>
          <p className="text-sm sm:text-base">
            We use cookies to store information about your preferences and to
            track your use of the website. This helps us to provide you with a
            better service, and also to improve our website.
          </p>
          <h1 className="text-lg sm:text-xl">Third-Party Services</h1>
          <p className="text-sm sm:text-base">
            We use third-party services such as Google Analytics to help us
            understand how you use the website. These services may collect
            information about your use of the website, such as the pages you
            visit and the links you click.
          </p>
          <h1 className="text-lg sm:text-xl">Changes to This Privacy Policy</h1>
          <p className="text-sm sm:text-base">
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new privacy policy on this page.
            You are advised to review this privacy policy periodically for any
            changes. Changes to this privacy policy are effective immediately
            after they are posted on this page.
          </p>
          <h1 className="text-lg sm:text-xl">Contact Us</h1>
          <p className="text-sm sm:text-base">
            If you have any questions about this privacy policy, please contact
            us at{" "}
            <a href="mailto:admin@thecheekco.com">admin@thecheekco.com </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
