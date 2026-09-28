import React from 'react';
import { 
  ShieldAlert, 
  Trees, 
  LifeBuoy, 
  Fish, 
  Anchor, 
  Flame, 
  ArrowRight,
  Send,
  BellRing
} from 'lucide-react';

export const ResponseImpactSection: React.FC = () => {
  const steps = [
    { name: 'DETECT', desc: 'Spaceborne SAR & Optical Ingest' },
    { name: 'ASSESS', desc: 'Volumetric & Weathering Analysis' },
    { name: 'ATTRIBUTE', desc: 'Hindcast & AIS Vessel Matching' },
    { name: 'FORECAST', desc: 'Hydrodynamic Drift Corridor' },
    { name: 'ALERT', desc: 'Stakeholder Notification Engine' },
    { name: 'RESPOND', desc: 'Coast Guard & Tier-1 Boom Containment' }
  ];

  const applications = [
    {
      title: 'Environmental Protection',
      desc: 'Guarding sensitive coral reefs, pelagic biodiversity, and marine biosphere reserves from toxic hydrocarbon contamination.',
      icon: Trees,
    },
    {
      title: 'Marine Safety & Enforcement',
      desc: 'Equipping Coast Guard and maritime police units with actionable target intercepts and non-repudiable evidentiary logs.',
      icon: LifeBuoy,
    },
    {
      title: 'Coastal & Mangrove Protection',
      desc: 'Predicting shoreline stranding timelines 48 hours in advance to pre-deploy protective oil containment booms and skimmers.',
      icon: ShieldAlert,
    },
    {
      title: 'Fisheries & Aquaculture',
      desc: 'Providing timely water-quality and toxic slick exclusion advisories to artisanal fisheries and offshore mariculture installations.',
      icon: Fish,
    },
    {
      title: 'Blue Economy & Port Authorities',
      desc: 'Protecting commercial anchorages, port fairways, and desalinization plant intakes from navigational contamination downtime.',
      icon: Anchor,
    },
    {
      title: 'Disaster Response & NOS-DCP',
      desc: 'Fulfilling National Oil Spill Disaster Contingency Plan command requirements with standardized operational reporting.',
      icon: Flame,
    }
  ];

  return (
    <section className="relative py-28 bg-[#FFFFFF] border-b border-[#E2EDF3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF8FC] border border-[#D5EBF5] mb-4">
            <BellRing className="w-3.5 h-3.5 text-[#087EA4]" />
            <span className="text-[11px] font-mono tracking-wider font-semibold text-[#087EA4] uppercase">
              Operational Mission
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A2B] tracking-tight leading-tight">
            From Detection to Response.
          </h2>

          <p className="mt-4 text-base text-[#486581] leading-relaxed">
            Oil spill intelligence is only as valuable as the speed and precision with which responders can act. POSEIDON bridges spaceborne algorithms and on-water containment operations.
          </p>
        </div>

        {/* 6-Stage Operational Workflow Strip */}
        <div className="bg-[#F8FCFF] border border-[#DCEBF2] rounded-2xl p-6 sm:p-8 shadow-sm mb-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
            {steps.map((st, i) => (
              <div key={st.name} className="relative flex flex-col items-center text-center group">
                <div className="w-10 h-10 rounded-full bg-[#EEF8FC] border border-[#D5EBF5] flex items-center justify-center font-mono text-xs font-bold text-[#087EA4] group-hover:bg-[#087EA4] group-hover:text-white transition-all shadow-sm">
                  {i + 1}
                </div>

                <div className="mt-3 text-xs font-extrabold text-[#071A2B] tracking-wider uppercase">
                  {st.name}
                </div>

                <div className="mt-1 text-[11px] text-[#627D98] leading-tight font-sans">
                  {st.desc}
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-5 -translate-y-1/2 text-[#DCEBF2] font-mono text-xs">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 6 Core Application Sectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app, i) => {
            const Icon = app.icon;
            return (
              <div
                key={app.title}
                className="bg-white border border-[#DCEBF2] rounded-xl p-6 shadow-sm hover:shadow hover:border-[#087EA4]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#EEF8FC] text-[#087EA4] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-[#071A2B] tracking-tight">
                    {app.title}
                  </h3>

                  <p className="mt-2 text-xs text-[#486581] leading-relaxed">
                    {app.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
