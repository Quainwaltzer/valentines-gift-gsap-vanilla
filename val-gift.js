
gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother, ScrambleTextPlugin);


window.addEventListener('load', () => {
let split = SplitText.create('.main-content h1', {type: 'chars'});
ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
	smooth: 2,
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
            markers: true
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
                markers: i === 0 ? true : false
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
});
  