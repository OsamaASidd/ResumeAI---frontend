
export const HEADER_MENUS = [
    {
        path: '/home',
        routeName: 'Home',
    },
    {
        path: '/market-place',
        routeName: 'Market Place',
    },
    {
        path: '/profile',
        routeName: 'My Profile',
    }
]


export const SIDEBAR_MENUS = [
    {
        path: '/new-resume',
        routeName: 'New Resume',
        icon: '/assets/user.svg',
    },
    {
        path: '/enhance-resume',
        routeName: 'Enhance Resume',
        icon: '/assets/user.svg',
        
    },
    {
        path: '/upload-files',
        routeName: 'Upload Files',
        icon: '/assets/user.svg',
    },
    {
        path: '/ai-chat',
        routeName: 'AI Chat',
        icon: '/assets/user.svg',
       
    },
    {
        path:'/settings',
        routeName: 'Settings',
        icon: '/assets/right.svg',
        
    }
];


export const TEMPLATES_CATEGORIES = [
    {
        name: 'All Templates',
        id: 'all',
    },
    {
        name: 'Professional',
        id: 'professional',
    },
    {
        name: 'Creative',
        id: 'creative',
    },
    {
        name: 'Academic',
        id: 'academic',
    },
    {
        name: 'No Experienced Based',
        id: 'no_experience',
    },
]


export const MOCK_TEMPLATES = [
    {
      id: "1",
      title: "Modern Professional",
      category: "professional",
      preview: "/assets/cv-template.svg",
    },
    {
      id: "2",
      title: "Creative Splash",
      category: "creative",
      preview:  "/assets/cv-template.svg",
    },
  ];
  