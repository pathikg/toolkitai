import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/">
                    <Button variant="ghost" className="mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>

                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: November 22, 2025</p>

                    <div className="prose prose-lg max-w-none space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Welcome to ToolkitAI. We respect your privacy and are committed to protecting your personal information.
                                This policy explains how we handle your data when you use our AI-powered creative tools.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Account information (email address and profile details)</li>
                                <li>Content you upload (images, videos, audio, text)</li>
                                <li>Usage data and analytics</li>
                                <li>Device and browser information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
                            <p className="text-gray-700 mb-3">We use your information to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Provide and improve our AI services</li>
                                <li>Process your content and generate results</li>
                                <li>Maintain and secure your account</li>
                                <li>Communicate service updates</li>
                                <li>Analyze usage patterns to enhance user experience</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Storage and Security</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li><strong>Temporary Processing:</strong> Uploaded files are processed in real-time and automatically deleted after processing</li>
                                <li><strong>Encryption:</strong> All data transmissions are encrypted using industry-standard protocols</li>
                                <li><strong>Secure Infrastructure:</strong> We use secure cloud infrastructure to protect your data</li>
                                <li><strong>No Long-term Storage:</strong> We do not permanently store your uploaded content</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">AI-Generated Content</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>All AI-generated images include a &quot;toolkitai.io&quot; watermark</li>
                                <li>You receive full usage rights to content created with our tools</li>
                                <li>Generated content is available for immediate download</li>
                                <li>We do not use your generated content for marketing or training without consent</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
                            <p className="text-gray-700 mb-3">You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Access your personal data</li>
                                <li>Request data correction or deletion</li>
                                <li>Withdraw consent at any time</li>
                                <li>Export your data</li>
                                <li>Object to data processing</li>
                            </ul>
                            <p className="text-gray-700 mt-3">
                                Contact us at <a href="mailto:privacy@toolkitai.io" className="text-indigo-600 hover:underline">privacy@toolkitai.io</a> to exercise your rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
                            <p className="text-gray-700">
                                We use essential cookies for authentication and session management. You can control cookies through
                                your browser settings, though this may affect functionality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
                            <p className="text-gray-700">
                                We use trusted third-party services to power our AI tools and manage user accounts.
                                These services are bound by strict confidentiality and data protection agreements.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children&apos;s Privacy</h2>
                            <p className="text-gray-700">
                                Our services are not intended for users under 13 years of age. We do not knowingly collect
                                information from children.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
                            <p className="text-gray-700">
                                We may update this policy occasionally. Continued use of our services after changes constitutes
                                acceptance of the updated policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:privacy@toolkitai.io" className="text-indigo-600 hover:underline">privacy@toolkitai.io</a></p>
                                <p className="text-gray-700 mt-2"><strong>Website:</strong> toolkitai.io</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

