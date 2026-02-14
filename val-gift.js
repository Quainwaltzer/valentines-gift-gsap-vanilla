
gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother, ScrambleTextPlugin);


window.addEventListener('load', () => {
let split = SplitText.create('.main-content h1', {type: 'chars'});
ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
	smooth: 1.5,
	effects: true,
    normalizeScroll: true
});
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: '.first-one',
        start: 'top top',
        end: 'center top',
        scrub: 3,
        pin: true,
        markers: false,
        
        onToggle: self => {
            if (self.isActive) {
                // Kill the 'display: none' callback from the previous fade-out
                gsap.killTweensOf('.rotating-element'); 
                
                gsap.set('.rotating-element', { display: 'flex' });
                gsap.to('.rotating-element', { opacity: 1, duration: 1, overwrite: true });
            } else {
                gsap.to('.rotating-element', { 
                    opacity: 0, 
                    duration: 1, 
                    overwrite: true,
                    onComplete: () => {
                        // Double check it's still supposed to be inactive before hiding
                        if (!self.isActive) gsap.set('.rotating-element', { display: 'none' });
                    }
                });
            }
        }
    }
}); 

tl.to('.upper-box', { 
    xPercent: -105, 
    rotation: -5, // Tilts the curtain outward
    scaleX: 0,   // Adds depth
    ease: "power2.inOut" 
}, 0)
.to('.lower-box', { 
    xPercent: 105, 
    rotation: 5, 
    scaleX: 0,   
    ease: "power2.inOut" 
}, 0);
 

const hello = gsap.timeline({
    scrollTrigger: {
        trigger: '.rotating-element',
        start: '80% 60%',
        toggleActions: "none none none none", 
    
        onEnter: () => {
            hello.timeScale(1).play(); 
        },
        
        onLeaveBack: () => {
            hello.timeScale(4).reverse(); 
            split = SplitText.create('.main-content h1', {type: 'chars'});
        }
    }
});
hello.from(split.chars, {
    y: 100,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    delay: 0.5,
    ease: "back.out(3)"
}, 0)
.from('.main-content h1', {scale: 0, duration: 2}, 0)
.fromTo('.h1-wrap p', {opacity: 0}, {opacity: 1, duration: 3}, 2)
.to('.h1-wrap p', {opacity: 0, duration: 3, ease: 'power2.inOut'}, '>')
.from('.img-wrap img', {translateX: '-100%', duration: 1, scale: 0}, 3)
.from('.img-wrap', {'--glow-x': '-110%', duration: 1, '--scale-x': '0'}, '<')
.to(".h1-wrap h1", {
    duration: 3,
    scrambleText: {
    text: "I just wanna say happy valentines bub!", 
    chars: "XOxklsajem,nshadhoasij.//.213", 
    revealDelay: 1, 
    speed: 0.3, 
    newClass: "myClass"
  }
}, '>')
.to(".h1-wrap h1", {
    duration: 3,
    scrambleText: {
    text: "Thank you so much for being a funny woman and a strong woman <3", 
    chars: "XOxklsajem,nshadhoasij.//.213", 
    revealDelay: 1, 
    speed: 0.3, 
    newClass: "myClass"
  }
}, '>+2')
.to('.h1-wrap p', {innerText: '(You can scroll now!)',opacity: 1, duration: 3, ease: 'power2.inOut'

}, '>');

    const scrollContainer = document.querySelector('.horizontal-scroll');
    const wrapper = document.querySelector('.horizontal-wrapper');
    const cards = gsap.utils.toArray(".photo-card"); //

    const getScrollAmount = () => {
    const scrollContent = document.querySelector('.horizontal-scroll');
    const wrapper = document.querySelector('.horizontal-wrapper');
    
    // 1. Get the actual pixel width of the horizontal-scroll content
    const contentWidth = scrollContent.scrollWidth;
    
    // 2. Get the inner width of the wrapper (Window width minus the 2% padding on both sides)
    const style = window.getComputedStyle(wrapper);
    const paddingLeft = parseFloat(style.paddingLeft);
    const paddingRight = parseFloat(style.paddingRight);
    const innerWrapperWidth = wrapper.offsetWidth - paddingLeft - paddingRight;

    // 3. The scroll distance is the content width minus the available visible space
    const scrollMax = contentWidth - innerWrapperWidth;

    return -scrollMax;
};

    // 1. Create the main horizontal scroll TWEEN first
    let scrollTween = gsap.to(scrollContainer, {
        x: getScrollAmount,
        ease: "none", // Critical for syncing
        scrollTrigger: {
            trigger: wrapper,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${Math.abs(getScrollAmount())}`,
            invalidateOnRefresh: true,
            markers: false
        }
    });

    // 2. Add individual animations for each card
    cards.forEach((card, i) => {
        const img = card.querySelector('.img-card-wrapper img');
        const infoItems = card.querySelectorAll('.info li'); // Select the list items
        const redBg = card.querySelector('.red');

        if (!img) return;

        // 1. Create a timeline for THIS card
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: i === 0 ? card : img, // Your logic: card for the first, img for others
                containerAnimation: scrollTween,
                start: i === 0 ? "top top" : "left 90%",
                toggleActions: "none none none none",
                onEnter: () => {
                    tl.timeScale(1).play();
                },
                onLeaveBack: () => {
                    tl.timeScale(4).reverse(); 
                },
                markers: i === 0 ? false : false
            }
        });

        // 2. Add the image animation to the timeline
        tl.from(img, {
            y: 100,
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        })
        .from(infoItems, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1, 
            ease: "power1.out"
        }, ">+1")
        .fromTo(redBg,{
            '--bg-width': '0%',
        },{
            '--bg-width': '100%',
            duration: 1
        }, '>');
    });

    const thirdSection = document.querySelector('.third-one');

    gsap.set(".snowflake", {
        x: () => Math.random() * window.innerWidth, // Random pixel value
        y: () => Math.random() * -200, // Start at different heights
        opacity: () => Math.random() * 0.8 + 0.2,
        scale: () => Math.random() * 1 + 0.5
    });

    const snowWrapper = document.querySelector('.snow-wrapper');
    const totalSnowflakes = 50; // Set any number you want here!

    for (let i = 0; i < totalSnowflakes; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.style.left = Math.random() * 100 + "vw";
        flake.style.scale = Math.random() * 1.5
        snowWrapper.appendChild(flake);
    }

    gsap.to(".snowflake", {
        y: "110dvh",
        x: "+=100", // Makes them drift together
        rotation: "random(0, 360)",
        duration: "random(5, 10)",
        repeat: -1,
        ease: "none",
        stagger: {
            amount: 5,
            repeat: -1
        },
        
    });

    const thirdTl = gsap.timeline({
        scrollTrigger: {
            trigger: thirdSection,
            markers: false,
            start: 'top-=100 top',
            end: 'bottom top',
            toggleActions: 'none none none none',
            onEnter: () => thirdTl.timeScale(1).play(),
            onLeaveBack: () => thirdTl.timeScale(3).reverse()
        }
    });

    thirdTl.to(thirdSection,{
        '--bg-third': '#ff7878',
        duration: 1,
        ease: 'power2.inOut'
    }, 0)
    .to(thirdSection,{
        '--bg-third-two': '#74d680',
        duration: 1,
        ease: 'power2.inOut'
    }, 0.3)
    .to('.third-wrapper h1', {
            duration: 3,
            scrambleText: {
            text: "The People I Was Terrified To Meet Last Christmas", 
            chars: "XOxklsajem,nshadhoasij.//.213", 
            revealDelay: 1, 
            speed: 0.3, 
            newClass: "myClass2"
        }
    }, 1)
    .from('.third-wrapper p', {
        opacity: 0,
        duration: 1
    },'>')
    .from('.todi-1',{
        y: 340,
        x: 760,
        rotateX: -11,
        rotateY: 11,
        rotateZ: -29,
        scale: 0,
        ease: 'power2.inOut',
        duration: 1.5
    }, 0)
    .from('.todi-2',{
        y: 200,
        x: -260,
        scale: 0,
        ease: 'power2.inOut',
        duration: 1.5
    }, 0)
    .to('.todi-1', {
        x: 50,
        y: 50,
        scale: 0.95,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: 'power2.inOut'
    })
    .to('.todi-2', {
        x: 50,
        y: -50,
        scale: 0.95,
        repeat: -1,
        yoyo: true,
        duration: 1,
        delay: 0.5,
        ease: 'power2.inOut'
    },3)
    .from('.bottom-element img', {
        opacity: 0,
        stagger: 0.3,
        duration: 1,
    }, 0)


   gsap.to(".cloud-track", {
        xPercent: -50, // Move exactly one image length
        duration: 30,  // Much slower for a realistic flight
        repeat: -1,
        ease: "none"   // Mandatory for seamless looping
    });

    const introFourth = gsap.timeline({
        scrollTrigger: {
            trigger: '.intro-to-fourth',
            start: '-30% top',
            toggleActions: "none none none none", 
            onEnter: () => {
                introFourth.timeScale(1).play(); 
            },
            
            onLeaveBack: () => {
                introFourth.timeScale(4).reverse(); 
                split = SplitText.create('.main-content h1', {type: 'chars'});
            }
        }
    })

    introFourth.fromTo('.future h1', {opacity: 0, duration: 3}, {
        opacity: 1,
        duration: 3,
        scrambleText: {
            text: "Wanna see more of our future?", 
            chars: "01X#%&@<>/?!$*()+_=", 
            revealDelay: 0.3, 
            speed: 0.05,
            tweenLength: true
        },
    }, 0)
    .from('.scroll-here', {
        duration: 1,
        opacity: 0,
        yoyo: true,
        repeat: -1,
        ease: 'power2.inOut'
    }, 0.3)

    const firstHero = SplitText.create('.first-hero', {type: 'chars'});
    const secondHero = SplitText.create('.second-hero', {type: 'chars'});

    const blurs = gsap.from([firstHero.chars, secondHero.chars], {
                stagger: 0.02,
                duration: 0.5,
                '--words-blur': '15px',
                opacity: 0,
                scrollTrigger: {
                    trigger: '.fourth-one',
                    start: 'top-=200 top',
                    toggleActions: "none none none none", 
                    onEnter: () => {
                        blurs.timeScale(1).play(); 
                    },
                    
                    onLeaveBack: () => {
                        blurs.timeScale(4).reverse(); 

                    }
                }
            });

    let insaneTl = gsap.timeline(
        {
            
            scrollTrigger: {
                trigger: '.fourth-one',
                scrub: 1,

                markers: false,
                start: 'top top',
                end: '+=40% top',
                invalidateOnRefresh: true,
                pin: '.window-wrapper',
                anticipatePin: 1,
                pinSpacing: false,
                onLeave: () => gsap.to(['.window', '.first-hero', '.second-hero'], { opacity: 0, duration: 0.5 }),
                onEnterBack: () => 
                    gsap.to(['.window', '.first-hero', '.second-hero'], { opacity: 1, duration: 0.5 }),
            },
        }
    );

    insaneTl.to('.window', {
        scale: 6.5,
    }, 0)
    .to('.first-hero', {
        xPercent: -640,
        y: -1000,
        scale: 6.5,
        opacity: 0,
    }, 0)
    .to('.second-hero', {
        xPercent: 640,
        y: 1000,
        scale: 6.5,
        opacity: 0,
    }, 0);

    gsap.to('.progress-bar',{
        height: '100%',
                scrollTrigger: {
                trigger: '.timeline-wrapper',
                markers: true,
                scrub: 1,
                start: 'top top',
                end: '80% top' 
        }
    });

     gsap.to('.timeline-wrapper',{
        y: -100,
                scrollTrigger: {
                trigger: '.texts',
                markers: false,
                scrub: 1,
                start: 'top top',
                end: '60% top' 
        }
    });

    gsap.utils.toArray(".left").forEach((card) => {
        const anim = gsap.from(card, {
            x: '-50vw',
            opacity: 0,
            duration: 1,
            paused: true,
            ease: 'power2.out'
        });

        ScrollTrigger.create({
            trigger: card,
            start: 'top center',
            end: 'bottom center',
            markers: true,
            toggleActions: 'none none none none',
            onEnter: () => anim.timeScale(1).play(),
            onLeaveBack: () => anim.timeScale(4).reverse()
        });
    });

    gsap.utils.toArray(".right").forEach((card) => {
        const anim = gsap.from(card, {
            x: '-50vw',
            opacity: 0,
            duration: 1,
            paused: true,
            ease: 'power2.out'
        });

        ScrollTrigger.create({
            trigger: card,
            start: 'top center',
            end: 'bottom center',
            markers: true,
            toggleActions: 'none none none none',
            onEnter: () => anim.timeScale(1).play(),
            onLeaveBack: () => anim.timeScale(4).reverse()
        });
    });



    ScrollTrigger.create({
        trigger: ".sunset-transition",
        start: "top center",
        end: "+=200%",
        pin: ".sunset-transition h1",
        pinSpacing: false, 
        markers: false,
        anticipatePin: 1
    });
});
  