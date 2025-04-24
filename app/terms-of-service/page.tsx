import { Card, CardContent } from "@/components/ui/card"
import { FileText, AlertTriangle, Shield, Clock, Users, HelpCircle } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12" id="terms-of-service">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Rules and guidelines for using the TradeWizard platform
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Last Updated: April 15, 2025</p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p>
            Welcome to TradeWizard. These Terms of Service ("Terms") govern your access to and use of the TradeWizard
            platform, including our website, mobile applications, and all related services (collectively, the
            "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to
            these Terms, you may not access or use the Service.
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Users className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Account Registration and Eligibility</h2>
                  <div className="space-y-4 text-gray-500 dark:text-gray-400">
                    <p>
                      <strong>Eligibility:</strong> To use the Service, you must be at least 18 years old and capable of
                      forming a binding contract. If you are accessing the Service on behalf of a company or other legal
                      entity, you represent that you have the authority to bind such entity to these Terms.
                    </p>
                    <p>
                      <strong>Account Registration:</strong> To access certain features of the Service, you must create
                      an account. You agree to provide accurate, current, and complete information during the
                      registration process and to update such information to keep it accurate, current, and complete.
                    </p>
                    <p>
                      <strong>Account Security:</strong> You are responsible for safeguarding your account credentials
                      and for all activities that occur under your account. You agree to notify us immediately of any
                      unauthorized use of your account or any other breach of security.
                    </p>
                    <p>
                      <strong>One Account Per User:</strong> You may not create multiple accounts for the same person.
                      We reserve the right to terminate duplicate accounts.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h2 className="text-xl font-bold mb-2">User Responsibilities and Conduct</h2>
                  <div className="space-y-4 text-gray-500 dark:text-gray-400">
                    <p>By using the Service, you agree to:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Comply with all applicable laws and regulations</li>
                      <li>Respect the intellectual property rights of others</li>
                      <li>Not use the Service for any illegal or unauthorized purpose</li>
                      <li>Not attempt to gain unauthorized access to any portion of the Service</li>
                      <li>Not interfere with or disrupt the integrity or performance of the Service</li>
                      <li>Not engage in any form of automated data collection without our prior consent</li>
                      <li>Not use the Service to transmit any viruses, malware, or other malicious code</li>
                    </ul>
                    <p>
                      We reserve the right to terminate or suspend your access to the Service immediately, without prior
                      notice or liability, for any reason, including breach of these Terms.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Disclaimer and Risk Warning</h2>
                  <div className="space-y-4 text-gray-500 dark:text-gray-400">
                    <p>
                      <strong>Not Financial Advice:</strong> The information provided through the Service is for
                      informational purposes only and does not constitute financial, investment, legal, or tax advice.
                      We do not recommend any specific securities, investments, or investment strategies.
                    </p>
                    <p>
                      <strong>Risk Warning:</strong> Trading in financial instruments involves high risks, including the
                      risk of losing some or all of your investment amount. Such activities are suitable only for
                      persons who understand and are willing to accept the financial, legal, and other risks involved.
                    </p>
                    <p>
                      <strong>Past Performance:</strong> Past performance is not indicative of future results. The value
                      of investments can go down as well as up, and you may not get back the amount invested.
                    </p>
                    <p>
                      <strong>Accuracy of Information:</strong> While we strive to provide accurate and up-to-date
                      information, we cannot guarantee the accuracy, completeness, or timeliness of the information
                      provided through the Service.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Subscription and Payment Terms</h2>
                  <div className="space-y-4 text-gray-500 dark:text-gray-400">
                    <p>
                      <strong>Subscription Plans:</strong> Some features of the Service may require a paid subscription.
                      The pricing, features, and terms of each subscription plan are described on our website.
                    </p>
                    <p>
                      <strong>Payment:</strong> You agree to pay all fees associated with your subscription plan. All
                      payments are non-refundable except as expressly provided in these Terms or as required by
                      applicable law.
                    </p>
                    <p>
                      <strong>Automatic Renewal:</strong> Subscriptions automatically renew at the end of each billing
                      period unless you cancel your subscription before the renewal date.
                    </p>
                    <p>
                      <strong>Price Changes:</strong> We reserve the right to change our subscription fees at any time.
                      If we change the fees for your subscription, we will provide notice of the change on the website
                      or by email at least 30 days before the change takes effect.
                    </p>
                    <p>
                      <strong>Taxes:</strong> All fees are exclusive of taxes, which may be added to the fees charged to
                      you.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Termination and Cancellation</h2>
                  <div className="space-y-4 text-gray-500 dark:text-gray-400">
                    <p>
                      <strong>Termination by You:</strong> You may terminate your account at any time by following the
                      instructions on the Service or by contacting our customer support.
                    </p>
                    <p>
                      <strong>Termination by Us:</strong> We reserve the right to terminate or suspend your account and
                      access to the Service at our sole discretion, without notice, for conduct that we believe violates
                      these Terms or is harmful to other users of the Service, us, or third parties, or for any other
                      reason.
                    </p>
                    <p>
                      <strong>Effect of Termination:</strong> Upon termination, your right to use the Service will
                      immediately cease. All provisions of these Terms that by their nature should survive termination
                      shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of
                      liability.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="flex flex-col items-center">
            <p className="text-gray-500 dark:text-gray-400">Email: tradewizardteam@gmail.com</p>
            {/*<p className="text-gray-500 dark:text-gray-400">Phone: +91-22-4567-8902</p>
            <p className="text-gray-500 dark:text-gray-400">
              Address: Legal Department, TradeWizard India Pvt. Ltd., Level 8, Platina Building, BKC, Mumbai - 400051
            </p>*/}
          </div>
        </div>

        <p className="text-sm text-gray-400 text-center">
          By using TradeWizard, you acknowledge that you have read, understood, and agree to be bound by these Terms of
          Service.
        </p>
      </div>
    </div>
  )
}
