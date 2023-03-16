module.exports = {
  button: `
    group 
    hidden 
    [&.show]:flex 
    md:[&.show]:hidden 
    [&.has-volume]:hidden 
    w-[30px] 
    h-[30px] 
    bg-white 
    absolute 
    bottom-1/2 
    left-3 
    rounded-2xl 
    bg-no-repeat 
    whitespace-nowrap 
    items-center 
    transition-[width] 
    duration-100 
    ease-linear 
    [&.expanded]:w-[97px] 
    [&.expanded]:overflow-hidden 
    after:absolute 
    after:top-[-7px] 
    after:left-[-7px]
     after:w-[150%] 
     after:h-[150%] 
     after:animate-pulse-ring 
     after:border-4 
     after:border-solid 
     after:border-white 
     after:rounded-full 
     [&.expanded]-after:hidden
     `,
  button__text: `
      hidden 
      text-black 
      text-[11px] 
      ml-[35px] 
      group-[.expanded]:inline-block
      `,
}


