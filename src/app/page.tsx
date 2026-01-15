import Link from "next/link";
import { Shield, MapPin, MessageCircle, CheckCircle, Heart, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

function OwlMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#0F4C81" />
      <ellipse cx="35" cy="45" rx="12" ry="14" fill="#E8F4F8" />
      <ellipse cx="65" cy="45" rx="12" ry="14" fill="#E8F4F8" />
      <circle cx="35" cy="47" r="6" fill="#333333" />
      <circle cx="65" cy="47" r="6" fill="#333333" />
      <circle cx="37" cy="45" r="2" fill="#FFFFFF" />
      <circle cx="67" cy="45" r="2" fill="#FFFFFF" />
      <path d="M45 62 L50 70 L55 62" fill="#B31942" stroke="#B31942" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 25 Q35 15 45 28" fill="none" stroke="#0F4C81" strokeWidth="4" />
      <path d="M70 25 Q65 15 55 28" fill="none" stroke="#0F4C81" strokeWidth="4" />
      <ellipse cx="35" cy="30" rx="3" ry="4" fill="#E8F4F8" />
      <ellipse cx="65" cy="30" rx="3" ry="4" fill="#E8F4F8" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] via-white to-[#E8F4F8]">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <OwlMascot className="w-10 h-10" />
            <span className="text-xl font-bold text-[#0F4C81]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Aureus</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/chat" className="text-[#0F4C81] hover:text-[#3C3B6E] font-medium transition-colors">
              Start Chat
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-[#0F4C81]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#B31942]/5 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="animate-fade-in opacity-0">
                <div className="inline-flex items-center gap-2 bg-[#E8F4F8] text-[#0F4C81] px-4 py-2 rounded-full text-sm font-medium mb-8">
                  <Shield className="w-4 h-4" />
                  Verified Healthcare Resources
                </div>
              </div>
              
              <h1 className="animate-fade-in opacity-0 delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F4C81] mb-6 leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Find the Care You Deserve
              </h1>
              
              <p className="animate-fade-in opacity-0 delay-200 text-lg sm:text-xl text-[#6B7280] mb-8 max-w-2xl mx-auto leading-relaxed">
                Aureus helps veterans, rural communities, and individuals with disabilities navigate healthcare resources through a trusted AI assistant.
              </p>
              
              <div className="animate-fade-in opacity-0 delay-300 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[#0F4C81] hover:bg-[#3C3B6E] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#0F4C81]/20 transition-all hover:shadow-xl hover:shadow-[#0F4C81]/30">
                  <Link href="/chat">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Your Search
                  </Link>
                </Button>
              </div>
              
              <p className="animate-fade-in opacity-0 delay-400 mt-6 text-sm text-[#6B7280]">
                Free to use. No account required.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F4C81] mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                How It Works
              </h2>
              <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
                Three simple steps to find verified healthcare resources near you
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="animate-slide-up opacity-0 text-center p-8 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-white border border-[#E5E7EB] hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#E8F4F8] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-[#0F4C81]" />
                </div>
                <div className="text-sm font-semibold text-[#B31942] mb-2">Step 1</div>
                <h3 className="text-xl font-bold text-[#333333] mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Share Your Needs
                </h3>
                <p className="text-[#6B7280]">
                  Tell Sam the Owl what type of healthcare service you&apos;re looking for and your location.
                </p>
              </div>
              
              <div className="animate-slide-up opacity-0 delay-100 text-center p-8 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-white border border-[#E5E7EB] hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#E8F4F8] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-[#0F4C81]" />
                </div>
                <div className="text-sm font-semibold text-[#B31942] mb-2">Step 2</div>
                <h3 className="text-xl font-bold text-[#333333] mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Get Matched
                </h3>
                <p className="text-[#6B7280]">
                  Our AI searches verified resources to find services that match your eligibility and location.
                </p>
              </div>
              
              <div className="animate-slide-up opacity-0 delay-200 text-center p-8 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-white border border-[#E5E7EB] hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#E8F4F8] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-[#0F4C81]" />
                </div>
                <div className="text-sm font-semibold text-[#B31942] mb-2">Step 3</div>
                <h3 className="text-xl font-bold text-[#333333] mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Connect
                </h3>
                <p className="text-[#6B7280]">
                  Receive contact information, addresses, and eligibility details with verified source links.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F4C81] mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Who We Serve
              </h2>
              <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
                Dedicated to supporting underserved communities with verified healthcare information
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-[#0F4C81]/10 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-[#0F4C81]" />
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Veterans
                </h3>
                <p className="text-[#6B7280]">
                  VA benefits, mental health services, PTSD support, disability claims assistance, and veteran-specific healthcare programs.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-[#B31942]/10 rounded-xl flex items-center justify-center mb-6">
                  <Building className="w-6 h-6 text-[#B31942]" />
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Rural Communities
                </h3>
                <p className="text-[#6B7280]">
                  Rural health clinics, telehealth options, community health centers, and transportation assistance programs.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-[#3C3B6E]/10 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-[#3C3B6E]" />
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Individuals with Disabilities
                </h3>
                <p className="text-[#6B7280]">
                  Accessible facilities, disability services, specialized care providers, and assistive technology resources.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#0F4C81] to-[#3C3B6E] rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
              </div>
              
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Built on Trust
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                  Every resource in our database is verified from official sources. We never provide medical advice—only connections to qualified professionals.
                </p>
                
                <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="flex flex-col items-center">
                    <Users className="w-8 h-8 mb-2" />
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-white/70">Verified Resources</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Shield className="w-8 h-8 mb-2" />
                    <div className="text-2xl font-bold">Zero</div>
                    <div className="text-sm text-white/70">Medical Advice</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Heart className="w-8 h-8 mb-2" />
                    <div className="text-2xl font-bold">Always</div>
                    <div className="text-sm text-white/70">Free to Use</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#E8F4F8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <OwlMascot className="w-20 h-20 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F4C81] mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Ready to Find Care?
            </h2>
            <p className="text-[#6B7280] text-lg mb-8">
              Sam the Owl is here to help you navigate healthcare resources. Start a conversation today.
            </p>
            <Button asChild size="lg" className="bg-[#B31942] hover:bg-[#8B1233] text-white px-8 py-6 text-lg rounded-xl shadow-lg">
              <Link href="/chat">
                Begin Your Search
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-[#0F4C81] text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <OwlMascot className="w-8 h-8 brightness-0 invert" />
              <span className="font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>Aureus</span>
            </div>
            <p className="text-white/70 text-sm text-center md:text-left">
              Aureus does not provide medical advice. Always consult healthcare professionals for medical decisions.
            </p>
            <div className="text-white/50 text-sm">
              &copy; {new Date().getFullYear()} Aureus Health Navigator
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
