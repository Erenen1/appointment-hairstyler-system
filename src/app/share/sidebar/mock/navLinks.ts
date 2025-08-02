export const data = {

    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/images/man-2.jpg",
    },


    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
        {
            title: "Sık Kullanılanlar",
            isActive: true,
            url: "/admin",
            items: [
                {
                    title: 'Randevu Takvimi',
                    isActive: true,
                    url: '/randevu-takvimi',
                },
                {
                    title: 'Hizmetler',
                    isActive: true,
                    url: '/hizmetler',
                },
                {
                    title: "Randevular",
                    url: "/randevular",
                },
                {
                    title: "Kategori",
                    url: "/kategori",
                },
                {
                    title: "Müşteriler",
                    url: "/musteriler",
                },
                {
                    title: "Personeller",
                    url: "/personeller",
                },

            ],
        },
        {
            title: "Raporlar",
            url: "#",
            items: [


                {
                    title: "Borçlar",
                    url: "/borclar",
                },
                {
                    title: "Alacaklar",
                    url: "/alacaklar",
                },
                {
                    title: "Tahsilatlar",
                    url: "/tahsilatlar",
                    isActive: true,
                },
            ],
        },
        {
            title: "Notlar",
            url: "#",
            items: [
                {
                    title: "Aranacaklar",
                    url: "/aranacaklar",
                },
                {
                    title: "Teklif Talepleri",
                    url: "/teklif-talepleri",
                },
                {
                    title: "İhtiyaçlar",
                    url: "/ihtiyaclar",
                },
            ],
        },
        // {
        //   title: "Notlar",
        //   url: "#",
        //   items: [
        //     {
        //       title: "Accessibility",
        //       url: "#",
        //     },
        //     {
        //       title: "Fast Refresh",
        //       url: "#",
        //     },
        //     {
        //       title: "Next.js Compiler",
        //       url: "#",
        //     },
        //     {
        //       title: "Supported Browsers",
        //       url: "#",
        //     },
        //     {
        //       title: "Turbopack",
        //       url: "#",
        //     },
        //   ],
        // },
    ],

}
