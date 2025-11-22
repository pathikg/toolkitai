import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: November 22, 2025</p>

                    <div className="prose prose-lg max-w-none space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                By using ToolkitAI, you agree to these Terms of Service. If you disagree with any part of these terms,
                                please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Services</h2>
                            <p className="text-gray-700">
                                ToolkitAI provides AI-powered creative tools including virtual try-on, face swap, background removal,
                                image generation, audio creation, and other AI processing services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>You must be at least 13 years old to use our services</li>
                                <li>You are responsible for maintaining account security</li>
                                <li>Provide accurate information during registration</li>
                                <li>One account per person</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">You agree NOT to:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Upload content you don&apos;t have rights to use</li>
                                <li>Generate harmful, illegal, or offensive content</li>
                                <li>Create deepfakes or misleading content to deceive others</li>
                                <li>Violate anyone&apos;s intellectual property or privacy rights</li>
                                <li>Use our services for harassment or harm</li>
                                <li>Attempt to hack, reverse engineer, or compromise our systems</li>
                                <li>Upload malware or malicious code</li>
                                <li>Generate inappropriate or explicit content</li>
                                <li>Use automated tools to abuse our services</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content Ownership & Usage Rights</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li><strong>Your Uploads:</strong> You retain ownership of all content you upload</li>
                                <li><strong>AI-Generated Content:</strong> You are granted full, perpetual, royalty-free rights to use AI-generated outputs for personal and commercial purposes</li>
                                <li><strong>Watermarks:</strong> All generated images include a &quot;toolkitai.io&quot; watermark</li>
                                <li><strong>Your Responsibility:</strong> Ensure you have rights to all content you upload and process</li>
                                <li><strong>No Resale of Service:</strong> You may not resell or redistribute our AI generation services themselves</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Watermarks</h2>
                            <p className="text-gray-700">
                                All AI-generated images include a visible &quot;toolkitai.io&quot; watermark. This watermark identifies
                                content as AI-generated and is a condition of using our service. Do not remove or obscure watermarks.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Services are provided &quot;as is&quot; without warranties</li>
                                <li>We do not guarantee uninterrupted or error-free service</li>
                                <li>AI results may vary and are not guaranteed to be perfect</li>
                                <li>We may modify or discontinue services at any time</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
                            <p className="text-gray-700">
                                ToolkitAI is not liable for indirect, incidental, or consequential damages arising from your use
                                of our services. We are not responsible for the quality or accuracy of AI-generated content.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content Moderation</h2>
                            <p className="text-gray-700">
                                We use AI safety filters to prevent harmful content generation. We reserve the right to review
                                and remove content or suspend accounts that violate these terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy</h2>
                            <p className="text-gray-700">
                                Your use of ToolkitAI is subject to our <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
                                Please review it to understand how we handle your data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>You may delete your account at any time</li>
                                <li>We may suspend or terminate accounts that violate these terms</li>
                                <li>We may discontinue services with or without notice</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
                            <p className="text-gray-700">
                                We may update these terms occasionally. Continued use after changes constitutes acceptance of updated terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:support@toolkitai.io" className="text-indigo-600 hover:underline">support@toolkitai.io</a></p>
                                <p className="text-gray-700 mt-2"><strong>Website:</strong> toolkitai.io</p>
                            </div>
                        </section>

                        <section className="border-t pt-6 mt-8">
                            <p className="text-sm text-gray-600 italic">
                                By using ToolkitAI, you acknowledge that you have read and agree to these Terms of Service.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

