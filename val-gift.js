
gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother, ScrambleTextPlugin);


window.addEventListener('load', () => {

    if (window.innerWidth <= 1024) {
        // Just kill the loader so the CSS "device-gate" is visible
        const loader = document.getElementById('loading-screen');
        if (loader) loader.style.display = 'none';
        
        // Stop the rest of the script from executing
        return; 
    }
    
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
                markers: false,
                scrub: 1.5,
                start: 'top top',
                end: 'bottom top' 
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
        const image = card.querySelector('img');
        const title = card.querySelector('h2');
            const paragraph = card.querySelector('p');

        const anim = gsap.timeline({ paused: true })
            .from(card, {
                rotationY: -10,
                rotationX: 10,
                transformPerspective: 1000,
                x: -300, 
                opacity: 0,
                duration: 3,
                ease: 'power4.out' 
            })
            .from(image, {
                scale: 1.2,
                duration: 2,
                ease: 'power2.out'
            }, 0)
            .from(title, {
                clipPath: 'inset(0 100% 0 0)',
                x: -20,
                duration: 1,
            }, "-=1.5")
            .from(paragraph, {
                clipPath: 'inset(100% 0% 0% 0)',
                x: -20,
                duration: 1,
            }, "-=2");

          card.addEventListener("mouseenter", () => {
                gsap.to(image, { 
                    scale: 1.02, 
                    duration: 1, 
                    boxShadow: "0px 0px 20px 5px rgba(255, 215, 0, 0.5)",
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(image, { 
                    scale: 1, 
                    duration: 1, 
                    ease: "power2.out",
                    boxShadow: "0px 0px 20px 5px rgba(255, 215, 0, 0)",
                    overwrite: "auto" 
                });
            });

        ScrollTrigger.create({
            trigger: card,
            start: 'top center', 
            toggleActions: 'play none none none', 
            markers: false,
            onEnter: () => anim.timeScale(1).play(),
            onLeaveBack: () => anim.timeScale(2).reverse() 
        });
    });

    gsap.utils.toArray(".right").forEach((card) => {
        const image = card.querySelector('img');
        const title = card.querySelector('h2');
        const paragraph = card.querySelector('p');
        const anim = gsap.timeline({ paused: true })
            .from(card, {
                rotationY: 40,      /* Flipped from -40 */
                rotationX: 10,
                transformPerspective: 1000,
                x: 300,             /* Flipped from -200 */
                opacity: 0,
                duration: 2.5,
                ease: 'power4.out',
                overwrite: 'auto',
                lazy: true
            })
            .from(image, {
                scale: 1.2,
                duration: 2,
                ease: 'power2.out'
            }, 0)
            .from(title, {
                clipPath: 'inset(0 100% 0 0)',
                x: 20,              /* Flipped from -20 */
                duration: 1,
            }, "-=1.5")
            .from(paragraph, {
                clipPath: 'inset(100% 0% 0% 0)',
                x: 20,              /* Flipped from -20 */
                duration: 1,
            }, "-=2");

            card.addEventListener("mouseenter", () => {
                gsap.to(image, { 
                    scale: 1.02, 
                    duration: 1, 
                    boxShadow: "0px 0px 20px 5px rgba(255, 215, 0, 0.5)",
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(image, { 
                    scale: 1, 
                    duration: 1, 
                    ease: "power2.out",
                    boxShadow: "0px 0px 20px 5px rgba(255, 215, 0, 0)",
                    overwrite: "auto" 
                });
            });

        ScrollTrigger.create({
            trigger: card,
            start: 'top center', 
            toggleActions: 'play none none none', 
            onEnter: () => anim.timeScale(1).play(),
            onLeaveBack: () => anim.timeScale(2).reverse() 
        });
    });

const h1s = gsap.utils.toArray('.sunset-transition h1s');
    ScrollTrigger.create({
        trigger: ".sunset-transition",
        start: "top center",
        end: "+=200%",
        pin: ".sunset-transition .sunset-first",
        pinSpacing: false, 
        markers: false,
        anticipatePin: 1
    });

       ScrollTrigger.create({
        trigger: ".sunset-transition",
        start: "top center",
        end: "+=200%",
        pin: ".sunset-transition .sunset-second",
        pinSpacing: false, 
        markers: false,
        anticipatePin: 1
    });

    // 1. Grab the elements
        const envelope = document.querySelector('.envelope');
        const expandBtn = document.querySelector('.expand-btn');
        const closeBtn = document.querySelector('.close-btn');

        // 2. Attach the listeners
        if (envelope) {
            envelope.addEventListener('click', openLetter);
        }

        if (expandBtn) {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                expandMessage();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeMessage);
        }

    function openLetter() {
    const tl = gsap.timeline();

    tl.to(".flap", { 
        rotationX: 180, 
        transformOrigin: 'top',
        duration: 0.6, 
        ease: "power2.inOut" 
    },0)
    .to("#paper", {
         zIndex: 3,
    }, 0.6)
    .to("#paper", { 
        y: -200, 
        duration: 3, 
        
        ease: "power2.inOut" 
    }, '>')
    .to("#paper", {
        zIndex: 4,
    }, '>')
    .to("#paper", {
        
        y: 0,
        duration: 3, 
        ease: "power2.inOut" 
    }, '>')
}


const paper = document.getElementById('paper');
const originalHTML = paper.innerHTML; // Save the 'Envelope' view


    
    // We use a delegated listener for the close button since its HTML is swapped
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn')) {
            closePaper(e);
        }
    });

    if (expandBtn) {
        expandBtn.addEventListener('click', expandPaper);
    }

    function expandPaper(e) {
        if (e) e.stopPropagation();
gsap.killTweensOf(paper);
        // 1. Lock the scroll
        gsap.to(['.sunset-first', '.sunset-second'], {opacity: 0, duration: 0.3});
        gsap.to('.paper-content', {opacity: 0, duration: 0.3});
        // 2. Expand the paper via CSS class
        gsap.to(paper, {height: '100dvh', width: '100dvw', top: '0%', left: '0%', y: 0,          // This "neutralizes" the -150px
                                clearProps: "transform", zIndex: 10000})

        // 3. Swap the content after the scale transition
        setTimeout(() => {
            paper.innerHTML = `
                <button class="close-btn">×</button>
                <div class="full-message-text" style="text-align: center; max-width: 600px;">
                    <h2 style="font-family: 'DM Serif Display'; color: #333;">To Geli,</h2>
                    <p style="font-family: 'Lexend'; line-height: 1.8; color: #444;">
                        Since 2023, every line of code I’ve written and every memory buffer I’ve filled has been better because of you. Looking back at how far we’ve come, I’m realized that you aren’t just a part of my life—you’re the person who makes the hard parts worth it.
                        <br>
                        I know I haven’t always been easy to deal with. I know there are days when I’m a headache, a source of stress, or even a "peck of sadness" to you. Thank you for staying through those glitches. Thank you for having the patience to debug my moods and for staying by my side when things got complicated. I promise to keep working on myself and to be better for you as time passes by.
                        <br>
                        Thank you so much, goofi, for being my biggest supporter in my studies. Having you in my corner makes the long nights and the hardships feel like just a temporary setup for something amazing.
                    <br>
                        I truly believe that someday, we are going to look back at these struggles from the top of our own success. All the stress we endure right now will just be a "thing of the past"—a story we tell while we enjoy the life we’ve built together. <3
                    </p>
                </div>
            `;
            
            // GSAP entrance for the text
            gsap.from(".full-message-text", { opacity: 0, y: 20, duration: 0.5 });
        }, 400);
    }

function closePaper(e) {
    if (e) e.stopPropagation();

    // 1. Create a "Grand Finale" timeline
    const finaleTl = gsap.timeline();

    finaleTl
        // Fade out everything (The envelope, the paper, the background)
        .to("body > *:not(#final-screen)", { 
            opacity: 0, 
            duration: 1, 
            ease: "power2.inOut",
            onStart: () => {
                // Prepare the final screen
                gsap.set("#final-screen", { display: 'flex' });
            }
        })
        // Fade in the final message
        .to("#final-screen", { 
            opacity: 1, 
            duration: 1.5, 
            ease: "power2.out" 
        }, "-=0.5") // Start slightly before the previous fade finishes
        // Subtle "float" animation for the text
        .from("#final-screen h1", {
            y: 30,
            duration: 2,
            ease: "elastic.out(1, 0.5)"
        }, "<");

    // 2. Cleanup (Optional: if you want to prevent scrolling forever)
    document.documentElement.style.overflow = 'hidden';
}

});
  
window.addEventListener('DOMContentLoaded', () => {
    const messages = [
        "> Loading Mauban_Memories...",
        "> Syncing Pagbilao_Rocks.obj",
        "> Calibrating Anniversary_LTS_v2...",
        "> Optimizing Love_Algorithm...",
        "> Deployment Ready."
    ];
    
    let tl = gsap.timeline({
        onComplete: () => {
            // Hide the loading screen
            gsap.to("#loading-screen", { 
                opacity: 0, 
                duration: 0.8, 
                onComplete: () => {
                    document.getElementById('loading-screen').style.display = 'none';
                    // Trigger your main entrance animations here if you have any!
                } 
            });
        }
    });

    // Animate the progress bar
    tl.to(".progress-fill", { width: "100%", duration: 3, ease: "none" });

    // Cycle through messages
    messages.forEach((msg, i) => {
        tl.to("#load-text", {
            text: msg,
            duration: 0.5,
            immediateRender: false
        }, i * 0.6); // Stagger the text updates
    });
});