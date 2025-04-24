import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Eye, FileText, Database, UserCheck } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12" id="privacy-policy">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">How we collect, use, and protect your information</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Last Updated: April 15, 2025</p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p>
            At TradeWizard, we are committed to protecting your privacy and ensuring the security of your personal
            information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
            you use our platform and services. By accessing or using TradeWizard, you consent to the practices described
            in this policy.
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Database className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Information We Collect</h2>
                  <div className="space-y-4 text-gray-500 dark:text-gray-400">
                    <p>
                      <strong>Personal Information:</strong> When you register for an account, we collect your name,
                      email address, phone number, and other information necessary to set up and maintain your account.
                    </p>
                    <p>
                      <strong>Financial Information:</strong> To provide our services, we may collect information about
                      your trading preferences, portfolio details, and transaction history. We do not store complete
                      payment card information on our servers.
                    </p>
                    <p>
                      <strong>Usage Data:</strong> We automatically collect information about how you interact with our
                      platform, including your IP address, browser type, pages visited, time spent on pages, and other
                      analytics data.
                    </p>
                    <p>
                      <strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking
                      technologies to enhance your experience, analyze usage patterns, and deliver personalized content.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <FileText className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h2 className="text-xl font-bold mb-2">How We Use Your Information</h2>
                  <div className="space-y-4 text-gray-500 dark:text-gray-400">
                    <p>
                      <strong>Provide and Improve Services:</strong> We use your information to operate, maintain, and
                      improve our platform and services, including developing new features and functionality.
                    </p>
                    <p>
                      <strong>Personalization:</strong> We may use your information to personalize your experience,
                      including tailoring content and recommendations based on your preferences and usage patterns.
                    </p>
                    <p>
                      <strong>Communication:</strong> We may use your contact information to send you important updates
                      about our services, respond to your inquiries, and provide customer support.
                    </p>
                    <p>
                      <strong>Marketing:</strong> With your consent, we may send you marketing communications about our
                      products, services, and promotions. You can opt out of these communications at any time.
                    </p>
                    <p>
                      <strong>Legal Compliance:</strong> We may use your information to comply with applicable laws,
                      regulations, and legal processes, including responding to lawful requests from public authorities.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Lock className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Data Security</h2>
                  <div className="space-y-4 text-gray-500 dark:text-gray-400">
                    <p>
                      We implement appropriate technical and organizational measures to protect your personal
                      information against unauthorized access, disclosure, alteration, and destruction. These measures
                      include:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Encryption of sensitive data both in transit and at rest</li>
                      <li>Regular security assessments and penetration testing</li>
                      <li>Access controls and authentication mechanisms</li>
                      <li>Continuous monitoring for suspicious activities</li>
                      <li>Regular backups to prevent data loss</li>
                    </ul>
                    <p>
                      While we strive to protect your personal information, no method of transmission over the Internet
                      or electronic storage is 100% secure. We cannot guarantee absolute security of your data.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Eye className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Information Sharing and Disclosure</h2>
                  <div className="space-y-4 text-gray-500 dark:text-gray-400">
                    <p>
                      We do not sell, rent, or trade your personal information to third parties for their marketing
                      purposes. We may share your information in the following circumstances:
                    </p>
                    <p>
                      <strong>Service Providers:</strong> We may share your information with third-party service
                      providers who perform services on our behalf, such as payment processing, data analysis, email
                      delivery, and hosting services.
                    </p>
                    <p>
                      <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all
                      or a portion of our assets, your information may be transferred as part of that transaction.
                    </p>
                    <p>
                      <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law
                      or in response to valid requests by public authorities (e.g., a court or government agency).
                    </p>
                    <p>
                      <strong>Protection of Rights:</strong> We may disclose your information to protect our rights,
                      privacy, safety, or property, as well as that of our users or others.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <UserCheck className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Your Rights and Choices</h2>
                  <div className="space-y-4 text-gray-500 dark:text-gray-400">
                    <p>You have certain rights regarding your personal information, including:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Accessing, correcting, or updating your personal information</li>
                      <li>Requesting deletion of your personal information</li>
                      <li>Objecting to or restricting certain processing of your data</li>
                      <li>Withdrawing consent where processing is based on consent</li>
                      <li>
                        Requesting a copy of your personal information in a structured, commonly used, and
                        machine-readable format
                      </li>
                    </ul>
                    {/*  <p>
                      To exercise these rights, please contact us at privacy@TradeWizard.com. We will respond to your
                      request within the timeframe required by applicable law.
                    </p> */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact Us About Privacy</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            If you have any questions or concerns about our Privacy Policy or data practices, please contact our Team:
          </p>
          <div className="flex flex-col items-center">
            <p className="text-gray-500 dark:text-gray-400">Email: tradewizardteam@gmail.com</p>
            {/* <p className="text-gray-500 dark:text-gray-400">Phone: +91-22-4567-8901</p>
            <p className="text-gray-500 dark:text-gray-400">
              Address: Data Protection Officer, TradeWizard India Pvt. Ltd., Level 8, Platina Building, BKC, Mumbai -
              400051
            </p> */}
          </div>
        </div>

        <p className="text-sm text-gray-400 text-center">
          This Privacy Policy is compliant with the Information Technology Act, 2000, and the Information Technology
          (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
        </p>
      </div>
    </div>
  )
}
