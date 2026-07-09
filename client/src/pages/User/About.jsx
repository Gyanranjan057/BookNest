import React from 'react'
import PageBanner from '../../Components/common/PageBanner'
import AboutIntro from '../../Components/AboutComponents/AboutIntro'
import MissionVision from '../../Components/AboutComponents/MissionVision'
import WhyChoose from "../../Components/HomeComponents/WhyChoose"
import OurTeam from '../../Components/AboutComponents/OurTeam'

const About = () => {
  return (
    <div>
      <PageBanner 
         title="About BookBazaar"
        subtitle="Learn more about our mission and vision"
      />
      <AboutIntro/>
      <MissionVision/>
      <WhyChoose/>
      <OurTeam/>
    </div>
  )
}

export default About