import { useState } from "react";
import { BookOpen, Video, Award, Users, Zap, Shield, Clock, TrendingUp } from 'lucide-react';
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    return (
        <>
            <div className="min-h-screen bg-white">
                {/* Navigation */}
                <nav className="fixed w-full bg-white shadow-sm z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">
                                    SkillSwap
                                </span>
                            </div>

                            <div className="hidden md:flex items-center gap-8">
                                <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
                                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">How It Works</a>
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="px-6 py-2 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition"
                                >
                                    Get Started
                                </button>

                            </div>

                            <button
                                className="md:hidden text-gray-900"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <div className="w-6 h-0.5 bg-gray-900 mb-1"></div>
                                <div className="w-6 h-0.5 bg-gray-900 mb-1"></div>
                                <div className="w-6 h-0.5 bg-gray-900"></div>
                            </button>
                        </div>
                    </div>

                    {isMenuOpen && (
                        <div className="md:hidden bg-white border-t border-gray-200">
                            <div className="px-4 py-4 space-y-3">
                                <a href="#features" className="block text-gray-600 hover:text-gray-900">Features</a>
                                <a href="#how-it-works" className="block text-gray-600 hover:text-gray-900">How It Works</a>
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="w-full px-6 py-2 bg-blue-600 rounded-lg text-white font-semibold"
                                >
                                    Get Started
                                </button>

                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50 to-white">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
                            <span className="text-blue-700 text-sm font-semibold"> Learn by Teaching, Grow by Sharing</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Exchange Skills,<br />
                            <span className="text-blue-600">
                                Earn Credit Points
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            A revolutionary platform where teaching improves your own skills. Share what you know, learn what you need, and build your reputation—all while earning credits for every session.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setShowLogin(true)}
                                className="px-8 py-4 bg-blue-600 rounded-lg text-white font-semibold text-lg hover:bg-blue-700 transition transform hover:scale-105"
                            >
                                Start Learning Free
                            </button>

                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-600">10K+</div>
                                <div className="text-gray-600 mt-1">Active Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-600">500+</div>
                                <div className="text-gray-600 mt-1">Skills Available</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-600">50K+</div>
                                <div className="text-gray-600 mt-1">Sessions Completed</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-4 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Why Choose SkillSwap?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Everything you need to learn, teach, and grow
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature Cards */}
                            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                    <Award className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Credit Point System</h3>
                                <p className="text-gray-600">
                                    Earn credits by teaching or passing tests. Use credits to book sessions with expert teachers and learn new skills.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                    <Video className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Live 1-on-1 Sessions</h3>
                                <p className="text-gray-600">
                                    Real-time video sessions using WebRTC and Zoom integration. Get personalized learning with direct interaction.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                                    <BookOpen className="w-8 h-8 text-orange-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Free Starter Courses</h3>
                                <p className="text-gray-600">
                                    New users get access to recorded beginner sessions. Learn the basics and earn your first credit points for free.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                                    <Shield className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure Testing</h3>
                                <p className="text-gray-600">
                                    Anti-cheat measures prevent copy-paste and tab switching. Timed questions with forward-only navigation ensure integrity.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                    <Users className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Verified Professionals</h3>
                                <p className="text-gray-600">
                                    Learn from college professors and industry professionals with verified credentials and salary conditions.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                    <TrendingUp className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Build Your Reputation</h3>
                                <p className="text-gray-600">
                                    Teaching not only helps others but improves your own skills and builds a strong reputation in the community.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-20 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                How It Works
                            </h2>
                            <p className="text-xl text-gray-600">
                                Get started in three simple steps
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                                    1
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Sign Up & Explore</h3>
                                <p className="text-gray-600">
                                    Create your account and access free beginner courses. Complete tests to earn your first credit points.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                                    2
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Learn or Teach</h3>
                                <p className="text-gray-600">
                                    Book 1-on-1 sessions to learn new skills, or create sessions to teach others and earn more credits.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                                    3
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Grow Together</h3>
                                <p className="text-gray-600">
                                    Build your reputation, level up your skills, and become part of a thriving learning community.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 bg-blue-600">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of learners and teachers exchanging skills every day.
                        </p>
                        <button className="px-10 py-4 bg-white rounded-lg text-blue-600 font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105">
                            Join SkillSwap Today
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-white">SkillSwap</span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Exchange skills, earn credits, and grow together.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-white mb-4">Platform</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li><a href="#" className="hover:text-white transition">Browse Skills</a></li>
                                    <li><a href="#" className="hover:text-white transition">Find Teachers</a></li>
                                    <li><a href="#" className="hover:text-white transition">Become a Teacher</a></li>
                                    <li><a href="#" className="hover:text-white transition">Free Courses</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-white mb-4">Company</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li><a href="#" className="hover:text-white transition">About Us</a></li>
                                    <li><a href="#" className="hover:text-white transition">Careers</a></li>
                                    <li><a href="#" className="hover:text-white transition">Blog</a></li>
                                    <li><a href="#" className="hover:text-white transition">Contact</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-white mb-4">Legal</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                                    <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                            <p>&copy; 2026 SkillSwap. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    openSignup={() => {
                        setShowLogin(false);
                        setShowSignup(true);
                    }}
                />
            )}

            {showSignup && (
                <SignupModal
                    onClose={() => setShowSignup(false)}
                    openLogin={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                    }}
                />
            )}
        </>
    );
}
export default Home;