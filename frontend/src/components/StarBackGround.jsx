import React, { useEffect, useState } from 'react'

const StarBackGround = () => {
    const [star,setstar] =useState([])
    const [metros,setmetros] =useState([])
   
    const generateStar=()=>{
        const numberOfStar=Math.floor((window.innerHeight*window.innerWidth)/10000)
        const newStar=[]
        for(let i=0;i<numberOfStar;i++){
            newStar.push({
                id:1,
                size:Math.random()*3+1,
                x:Math.random()*100,
                y:Math.random()*100,
                opacity:Math.random()*0.5+0.5,
                animationDuration:Math.random()*4+2,

            })
        }
        setstar(newStar)
    }

    const generateMetros=()=>{
        const numberOfMetors=4
        const newmetros=[]
        for(let i=0;i<numberOfMetors;i++){
            newmetros.push({
                id: `meteor-${i}`,
                size:Math.random()*2+1,
                x:Math.random()*100,
                y:Math.random()*2,
                delay:Math.random()*5,
                animationDuration:Math.random()*3+3,

            })
        }
        setmetros(newmetros)
    }
     useEffect(()=>{
        generateStar()
        generateMetros()
        const handelResize=()=>{
             generateStar()
        }
        window.addEventListener('resize',handelResize)

        return ()=>window.removeEventListener('resize',handelResize)
    },[])
  return (
    <div className='fixed inset-0 overflow-hidden pointer-events-none z-0'>
     {star.map((star) => (
  <div
    key={star.id}
    className="star animate-pulse-subtle"
    style={{
      width: star.size + "px",
      height: star.size + "px",
      left: star.x + "%",
      top: star.y + "%",
      opacity: star.opacity,
      animationDuration: star.animationDuration + "s",
    }}
  />
))}

{metros.map((meteor) => (
  <div
    key={meteor.id}
    className="meteor animate-meteor"
    style={{
      width: meteor.size * 2 + "px",
      height: meteor.size + "px",
      left: meteor.x + "%",
      top: meteor.y + "%",
      animationDelay: meteor.delay + "s",
      animationDuration: meteor.animationDuration + "s",
    }}
  />
))}

    </div>
  )
}

export default StarBackGround