import { Product, PetCareAppointment, Client, Sale, BillPayable, Supplier, SupplierOrder, EmployeeUser, StoreSettings, BotSettings, OnlineOrder, BotChatMessage } from './types';

// Direct image URLs provided in the HTML prompt
export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmfmR0w11zxk4zsdEsF7op9O6suKJkThA3oC9RWxmrvTa5zsbVhLwl8ifguSIMaIwPKate0LdzFxzObk3Cqlaq6C7AX8laojv6TSj4Z_z4bbHjF4YDG7y1PalvHOls2AxsOkfQKOUFyWYU4GoyRvvmYVjbHwiARm7Cdv2rUBIAxOvqmJrfoI1kb07VAoedk6k9R9PyjgBuGyBbrPC31V1zSVeDv0Fp3rZulAuzoFH4PnXFJ4J11ZdWmQ',
  logoAlt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmfmR0w11zxk4zsdEsF7op9O6suKJkThA3oC9RWxmrvTa5zsbVhLwl8ifguSIMaIwPKate0LdzFxzObk3Cqlaq6C7AX8laojv6TSj4Z_z4bbHjF4YDG7y1PalvHOls2AxsOkfQKOUFyWYU4GoyRvvmYVjbHwiARm7Cdv2rUBIAxOvqmJrfoI1kb07VAoedk6k9R9PyjgBuGyBbrPC31V1zSVeDv0Fp3rZulAuzoFH4PnXFJ4J11ZdWmQ',
  managerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA9GbaVx_r4m3xRP7B4EEn4plOngq2Ub5Urbqr2ne1YUTfSrh6Fn-f7WoiGQY16VdB9gaTXA7nQSCiUQqbHA8o22Bv4hhgmOVvofQCsfgGR9GnY_TkeACWNs3NebYb_kOwZFz8zs4FL4LPxJORcfEasP1lzQ7Z5hzr3Mee5sbLQ9MXEiE5nYDQ7bxLAzJzr4UmAMP3Uf3_W91-knMgznA272JgIahi_o47VZn2P9TeEe0DxT8CTz5AyA',
  profileAlt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA9GbaVx_r4m3xRP7B4EEn4plOngq2Ub5Urbqr2ne1YUTfSrh6Fn-f7WoiGQY16VdB9gaTXA7nQSCiUQqbHA8o22Bv4hhgmOVvofQCsfgGR9GnY_TkeACWNs3NebYb_kOwZFz8zs4FL4LPxJORcfEasP1lzQ7Z5hzr3Mee5sbLQ9MXEiE5nYDQ7bxLAzJzr4UmAMP3Uf3_W91-knMgznA272JgIahi_o47VZn2P9TeEe0DxT8CTz5AyA',
  
  // Clients & Pets
  donaMaria: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdno128G38ZZHwtr1SJYxf-ktk0L8deP_ca4CUTKEbjdxALvXZOBHBJMbl7w5eQSsvqphpO6_0k-DiDUZYM9nNTdsQAFcgYM5HaeaZbyLy_XH2wxcGyqmwniIqF89gu_hDg2Or5AZv8YNJWUkCo7Ig7-ZX7j2OwvplGV9gBN-dBtc8-EjWOf3nM_nAVfDk0gepSqKnjIjgrtfwbjqTRJBUcnczHTUG7dW9KyJWyh66Mo71nXgyjhV3qA',
  carlosEduardo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6MMKXJ5RW08wTP1bR69Qg2hSPuySM3GX9UhV9ZQPupZQvJGPUgAvbs7qn9bqocP3c9qeTzfhr4L7dcJLszJBJtUJrbJMmgK3uZtlUh1YxUv0xmsU_YbXuWHPxfJZwDY0ZVn-uwKZLxkBHjGHULgQNjiRm6tD3Yi7sYZOwqxt7-zXZr6ZAY737GUDknMgUnva7kBn-RybDyjlbcg80Hiq9AvMZEOEl-7ExvN5Oz9HlmHMSqSEOCIBOfQ',
  sitioRecanto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe5L4a6N8vmrI0toRDfTp-QZryukUd-fZQFbxbmQQdpZKsx0S3EV3H8bA3CA-TfjGfhhi1_lZCtkhvHk-JlGiH-ciQvPPx10Cezl0QL-yfHFsta3BS4MYSK9wn1vYCo2v5ZDcFqVWpjp6R5S05f3DTc4m_e1mrVc0T1G6BaD6gvxWjdHYXj-eOHV7yOvUF5KAAstaGlvRIZ2P2lh6DTIh6DeVjPKYeBXHpz1ojmktyMknH1cVEMBz33w',
  clientMaria: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdno128G38ZZHwtr1SJYxf-ktk0L8deP_ca4CUTKEbjdxALvXZOBHBJMbl7w5eQSsvqphpO6_0k-DiDUZYM9nNTdsQAFcgYM5HaeaZbyLy_XH2wxcGyqmwniIqF89gu_hDg2Or5AZv8YNJWUkCo7Ig7-ZX7j2OwvplGV9gBN-dBtc8-EjWOf3nM_nAVfDk0gepSqKnjIjgrtfwbjqTRJBUcnczHTUG7dW9KyJWyh66Mo71nXgyjhV3qA',
  clientAntonio: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe5L4a6N8vmrI0toRDfTp-QZryukUd-fZQFbxbmQQdpZKsx0S3EV3H8bA3CA-TfjGfhhi1_lZCtkhvHk-JlGiH-ciQvPPx10Cezl0QL-yfHFsta3BS4MYSK9wn1vYCo2v5ZDcFqVWpjp6R5S05f3DTc4m_e1mrVc0T1G6BaD6gvxWjdHYXj-eOHV7yOvUF5KAAstaGlvRIZ2P2lh6DTIh6DeVjPKYeBXHpz1ojmktyMknH1cVEMBz33w',
  clientMarcos: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6MMKXJ5RW08wTP1bR69Qg2hSPuySM3GX9UhV9ZQPupZQvJGPUgAvbs7qn9bqocP3c9qeTzfhr4L7dcJLszJBJtUJrbJMmgK3uZtlUh1YxUv0xmsU_YbXuWHPxfJZwDY0ZVn-uwKZLxkBHjGHULgQNjiRm6tD3Yi7sYZOwqxt7-zXZr6ZAY737GUDknMgUnva7kBn-RybDyjlbcg80Hiq9AvMZEOEl-7ExvN5Oz9HlmHMSqSEOCIBOfQ',
  clientCamila: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdno128G38ZZHwtr1SJYxf-ktk0L8deP_ca4CUTKEbjdxALvXZOBHBJMbl7w5eQSsvqphpO6_0k-DiDUZYM9nNTdsQAFcgYM5HaeaZbyLy_XH2wxcGyqmwniIqF89gu_hDg2Or5AZv8YNJWUkCo7Ig7-ZX7j2OwvplGV9gBN-dBtc8-EjWOf3nM_nAVfDk0gepSqKnjIjgrtfwbjqTRJBUcnczHTUG7dW9KyJWyh66Mo71nXgyjhV3qA',
  
  // Pet Care Grooming
  thorGolden: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWZS83xQM_GvuWyjdxaaGD-lf5PQ5L5rccb9A9MXWHz4HxthBQJ7RnETJpn96PDaZiyQwsJAvGd70vF4MRJ62K6gBnNaMOVvYsXTAL1ae65qKn1LihAy4kKwClCB6N-hNpTnpL0G_8gsof5Dc45ZIB2FFcc8YFVNo_MnniuGjlk43kP8f4ZAEI56c_twxst2geZE0xBKiZ5T4HTLichis-fgTetRvymenrg0y_nyThSkGMkr31j4Ue_w',
  lunaShihTzu: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfYHQ0r6ou7RKIHjunkfAXXNPpFZdMqjw4XjVuTOHuMWG73if89RGPeaKb-f8mYPoDHG_hM-uIXdXMprcJJ8UEULLWYZpU95jUgXV0FJ-Lho_gMgdS64hpYRHqleoaK9OmSWOHQKkEWDQYkfeILe5qC5pcb2HKGcLcihpoLa4Q4EN_ykqx8gj9boTn9xa7va1rFZlsO1oJ0BqSeYFl4TUuy5wyQsiwrRsGsoTp5oKHdugJllUkJGOFuA',
  bobMutt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWaW57l99B8V7R7CDgMH7lFXxzOP8qDRE5wMypBmO3WUYtSrOolXCK16lEjjKHl83w67HWj-O3pKTytoSdMAySTslUVMeumg-yxU5zyw_fxUcmUIriiXqfoGCEnOBn8vDXh2eKHXFOO7kLpoXwr2ODbWK89sse4AWRkLLye6SQykNu5X70GajVIFQeZdVWppXsVb6SGahzMK2FTH22FukMLnPWjo4Hej73KtdZy5qZY2D4k3EK9AN0Ow',
  pipocaSalon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBpHsV91-dWYvqauLXuBGYwhhcJI4CF-UYdUdrVCdx6HE9hiqwqebc7yc9z31tTc0wJD7-WoJZDyx28YzmrG8KHreLHmdsf_65WZIASVjvWBIOgYyaoeopXdNCT40PJLjRnqEtNy3oWKYNmXjmbC82dGDmv7Ril_H1Qk1BQ7WfKTkK7fY4Ff8xN2h8fid123ChHWfgLNMA8fctJ-wXPXF1C05Nb1_2UQREr-AtP-SlELvMo92yfOBS_w',
  thorSmiley: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGVZhX4bDiHn1PeDcIPtWXKX_fPTIWNxsvVWDbGgg-gIxXhHxE26nNBH_xLLt1OJyKAw7URHRL6ZzmTDSaOb1kuBc1176hiol9BMc8mR0H6wp07m-fDqwTEtXXalDwW9rDkYQoFz8J7k411hPT97sFfUEIx2ZADyeSoXt3mMtdBE7XKzITOWpvBN9uZ9WIdXOwGYiuLCPC3Ss5LxcFrzCcaSnDM1bgkSJNrZOsp_wEzOtk1haqvYQ4mw',
  lunaBulldog: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO9skEQgDjPr7wJ_QLIdnK5XpVmD0uk1WkmqEtskr08Gsvl3zDLncsRV3s_ey7gMVZM80jh5V0SVV12xXCK2TyxHXMvOiiwci0EqOsAS3eBdG-IpbymPnt1QXxYnIMD_XeSXK7hValY51kBJ9MnjnO0tU7H5xljNWMDMCjxJZYUN1i-S-2vtqRDHYfQ9PHbFxWSuSsSfItlE6z504ZVLBao64aWYHFdbw5nblHEsUuPkZgwt5jZWmh-w',

  // Products
  royalCanin: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjIgY_C2rmqWDPNoPGdd08Ntr4t7Vm_8MiCahpNTNCZ4EyrWnteMO0rU-sCA8D63KiNnc5rmhsfVobzYY9Y35qctF-9839xfnI_KMlyznK9Z8grpyxlhMzCdWAJIXoJwZo4sZWDlcY1WnpE86FB69dcZNIxEvI1glxpB1wkYydqc2DQdo1m-xeu8EmBUTPKq6SgcmRxCv5eUaYqLUI22YO1IJMX2B8xxIJ7gocj2jfdiqYZ8IFK_HIww',
  premierGranel: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJD9elX9yjM33kV8GVmzprUHst9PfwwD7W8HdvnDWf5nbxdFf7QANuIA8ukgkorG60lqJnoC913s8T6n3g89GORw3f_04Rhp099XEGgjl8Xl7GGTCZZ_w9YZ57BZagmitSs8xIqNqfR6tMWBWrtv3ln6KHyHc4O7Wg8rQz6Fu9W3sDpz1Jokzo2hrsuH3acVCfHYyg94xx5YINBEiG8Gld0lW3fb3NmomhyDVfD2hrNBw-6J8KKF0IxA',
  specialDog: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5vBrSUEI-2F3FkuB5WQG1I1AFUtg5XKCOEbAN0fY51mYGmNvwe8aS0cOLke4tPdzyvoRMGDPaXIYv9VN0tmuoqvfOJdrw3-tHUnTBl_p3tgf2NIs7Xrjm0DtOzKzkuxcoP7QOw-ce5BF4RZqTqvXnfoMR5lja_C1x__ZeLayr7LXHMInzkG2_nYvL9XXV9TQq3LJ1Gy65GnAQPF7-Ki02dyKgM28pFhu1LTCcXIg0p-5xP_4IFLEzkQ',
  simparic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA_Lo2YjXbN_rFVe7aEUUEg_YBjEoVf5Mw0_9hm5jdh2LIdrdO0Os-wYIXr5YdNU0GyKFO4_Mt4IXRlwOUmcQhz5eeRxpsk4piEdZMG7JVpRjw8d2D1GdpNIzROWQDBdaeHyFDyBTZtz4fWxcLd58K1cvH7RcHNC1uI207zmJzS3T21SYwstiGfegqKuME4DDOSDANC6olSVWJIa0WNgxyhS7mGD3Z2neL2rnRbrgzbfTJFnBoKOKXYg'
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Ração Royal Canin Maxi Adult 15kg',
    category: 'fechados',
    sku: '78912345601',
    price: 349.90,
    costPrice: 265.00,
    marginPercent: 24.3,
    margin: '24.3%',
    unit: 'saco 15kg',
    stock: 8,
    minStock: 4,
    location: 'Depósito A • Prateleira 03',
    image: ASSETS.royalCanin,
    imageAlt: 'Ração Royal Canin Maxi Adult 15kg'
  },
  {
    id: 'prod-2',
    name: 'Premier Formula Adultos Granel',
    category: 'granel',
    sku: 'GRAN-004',
    price: 24.90,
    costPrice: 11.20,
    marginPercent: 55.0,
    margin: '55.0%',
    unit: 'kg',
    stock: 14,
    minStock: 5,
    location: 'Balde #04 • Lote 88B',
    image: ASSETS.premierGranel,
    imageAlt: 'Premier Formula Cães Granel',
    isGranel: true,
    remainingKg: 7.2,
    maxKg: 15.0,
    batch: '88B'
  },
  {
    id: 'prod-3',
    name: 'Special Dog Prime Frango 20kg',
    category: 'fechados',
    sku: '78977610023',
    price: 198.00,
    costPrice: 132.00,
    marginPercent: 33.3,
    margin: '33.3%',
    unit: 'saco 20kg',
    stock: 2,
    minStock: 5,
    location: 'Palete C-1',
    image: ASSETS.specialDog,
    imageAlt: 'Special Dog Prime 20kg',
    supplier: 'Distribuidora Noroeste'
  },
  {
    id: 'prod-4',
    name: 'Simparic 20 a 40kg (3 comp.)',
    category: 'farmacia',
    sku: 'SIMP-40MG',
    price: 115.00,
    costPrice: 78.00,
    marginPercent: 32.2,
    margin: '32.2%',
    unit: 'cx 3 comp',
    stock: 14,
    minStock: 6,
    location: 'Armário Travado #02',
    image: ASSETS.simparic,
    imageAlt: 'Simparic 20 a 40kg',
    expiration: '15/11/2025'
  },
  {
    id: 'prod-5',
    name: 'Milho Moído & Quebrado a Granel',
    category: 'granel',
    sku: 'GRAN-AGRO-01',
    price: 3.50,
    costPrice: 1.80,
    marginPercent: 48.6,
    margin: '48.6%',
    unit: 'kg',
    stock: 28,
    minStock: 10,
    location: 'Silo Seco 02',
    image: ASSETS.premierGranel,
    isGranel: true,
    remainingKg: 28.5,
    maxKg: 50.0
  },
  {
    id: 'prod-6',
    name: 'Petisco Bifinho Dog Supreme 500g',
    category: 'petcare',
    sku: '78912349911',
    price: 18.50,
    costPrice: 9.90,
    marginPercent: 46.5,
    margin: '46.5%',
    unit: 'un',
    stock: 45,
    minStock: 15,
    location: 'Gôndola Frente de Caixa',
    image: ASSETS.specialDog
  }
];

export const INITIAL_PETCARE: PetCareAppointment[] = [
  {
    id: 'pet-1',
    petName: 'Thor',
    petBreed: 'Golden Retriever',
    petAge: '3 anos',
    petSize: 'Porte Grande',
    services: ['Banho Completo', 'Tosa Higiênica', 'Hidratação'],
    observations: 'Atenção: Orelha sensível, usar protetor auricular impermeável.',
    tutorName: 'Marcos Silva',
    tutorPhone: '(11) 99999-8811',
    taxiDog: true,
    timeSlot: '09:00 - 10:30',
    price: 130.00,
    status: 'in-progress',
    image: ASSETS.thorGolden,
    imageAlt: 'Thor Golden Retriever no banho'
  },
  {
    id: 'pet-2',
    petName: 'Luna',
    petBreed: 'Shih Tzu',
    petAge: '2 anos',
    petSize: 'Porte Pequeno',
    services: ['Banho Simples', 'Corte de Unhas', 'Laço Cetim'],
    tutorName: 'Camila Rocha',
    tutorPhone: '(19) 98712-3344',
    taxiDog: false,
    timeSlot: '10:30 - 11:30',
    price: 75.00,
    status: 'ready',
    image: ASSETS.lunaShihTzu,
    imageAlt: 'Luna Shih Tzu com lacinho'
  },
  {
    id: 'pet-3',
    petName: 'Bob',
    petBreed: 'Vira-lata SRD',
    petAge: '4 anos',
    petSize: 'Porte Médio',
    services: ['Banho Antipulgas', 'Tosa Geral'],
    tutorName: 'Seu Antônio',
    tutorPhone: '(19) 99123-5566',
    taxiDog: false,
    timeSlot: '13:30',
    price: 90.00,
    status: 'waiting',
    image: ASSETS.bobMutt,
    imageAlt: 'Bob SRD',
    crossSellHint: 'Cliente Ração: Compra Premier Raças Médias 15kg todo mês.'
  },
  {
    id: 'pet-4',
    petName: 'Pipoca',
    petBreed: 'Shih-tzu',
    petAge: '1 ano',
    petSize: 'Porte Pequeno',
    services: ['Tosa Higiênica', 'Banho Relaxante'],
    tutorName: 'Dra. Camila',
    tutorPhone: '(19) 99812-4421',
    taxiDog: false,
    timeSlot: '14:00',
    price: 85.00,
    status: 'waiting',
    image: ASSETS.pipocaSalon
  },
  {
    id: 'pet-5',
    petName: 'Thor Jr',
    petBreed: 'Golden',
    petAge: '2 anos',
    petSize: 'Porte Grande',
    services: ['Banho + Hidratação'],
    tutorName: 'Sr. Marcelo',
    taxiDog: true,
    timeSlot: '15:15',
    price: 110.00,
    status: 'waiting',
    image: ASSETS.thorSmiley
  },
  {
    id: 'pet-6',
    petName: 'Luna Bela',
    petBreed: 'Bulldog Francês',
    petAge: '3 anos',
    petSize: 'Porte Pequeno',
    services: ['Banho Medicamentoso'],
    tutorName: 'Helena M.',
    taxiDog: false,
    timeSlot: '16:30',
    price: 95.00,
    status: 'waiting',
    image: ASSETS.lunaBulldog
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Dona Maria de Lourdes',
    phone: '(19) 99812-4421',
    neighborhood: 'Bairro São Cristóvão',
    pets: ['Bidu (Poodle)', 'Mimi (Gata SRD)'],
    recurringProduct: 'Cat Chow Salmão 3kg',
    recurringFrequency: 'A cada ~20 dias',
    debtBalance: 142.50,
    debtLimit: 300.00,
    creditLimit: 300.00,
    dueDate: 'Vence dia 05',
    isVerified: true,
    category: 'fiado',
    avatar: ASSETS.donaMaria,
    image: ASSETS.donaMaria,
    imageAlt: 'Dona Maria de Lourdes',
    lastPurchase: 'Ontem às 16:45'
  },
  {
    id: 'cli-2',
    name: 'Carlos Eduardo Peixoto',
    phone: '(19) 98711-2099',
    neighborhood: 'Centro',
    pets: ['Max (Pitbull dócil • 32kg)'],
    recurringProduct: 'Magnus Todo Dia Carne 15kg',
    recurringFrequency: 'Última compra: 12 dias',
    debtBalance: 0.00,
    debtLimit: 600.00,
    creditLimit: 600.00,
    loyaltyPoints: 350,
    availableDiscount: 20.00,
    isVip: true,
    category: 'fidelidade',
    avatar: ASSETS.carlosEduardo,
    image: ASSETS.carlosEduardo,
    imageAlt: 'Carlos Eduardo Peixoto',
    lastPurchase: 'Há 12 dias'
  },
  {
    id: 'cli-3',
    name: 'Sítio Recanto dos Pássaros',
    phone: '(19) 99102-8833',
    neighborhood: 'Zona Rural • Resp: José Carlos',
    pets: ['Milho Moído (Granel)', 'Farelo de Trigo (Sacas)', 'Ração Poedeira 50kg'],
    recurringProduct: 'Rações de postura e grãos moídos',
    recurringFrequency: 'Semanal',
    debtBalance: 680.00,
    debtLimit: 800.00,
    creditLimit: 800.00,
    dueDate: 'Venceu dia 01',
    isOverdue: true,
    overdueDays: 4,
    category: 'fiado',
    avatar: ASSETS.sitioRecanto,
    image: ASSETS.sitioRecanto,
    imageAlt: 'Sítio Recanto dos Pássaros',
    lastPurchase: 'Há 4 dias'
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-1',
    code: '#1042',
    paymentMethod: 'PIX',
    itemsSummary: 'Premier Raças Peq. 10kg + Bifinho',
    location: 'Balcão 01',
    timeAgo: 'Há 4 minutos',
    total: 189.90,
    status: 'Concluída'
  },
  {
    id: 'sale-2',
    code: '#1041',
    paymentMethod: 'Dinheiro',
    itemsSummary: '2.5kg Ração Pedigree Granel',
    location: 'Balança Central',
    timeAgo: 'Há 18 minutos',
    total: 35.00,
    status: 'Concluída',
    isGranel: true
  },
  {
    id: 'sale-3',
    code: '#1040',
    paymentMethod: 'Cartão Crédito',
    itemsSummary: 'Banho & Tosa Pipoca (Shih-tzu)',
    location: 'Terminal Maquininha',
    timeAgo: 'Há 35 minutos',
    total: 85.00,
    status: 'Concluída',
    isService: true
  }
];

export const INITIAL_BILLS: BillPayable[] = [
  {
    id: 'bill-1',
    supplier: 'Distribuidora Total Alimentos',
    description: 'Premier, Golden & Ração Úmida',
    docNumber: 'Doc: #9932-B',
    dueDateText: 'Vence em 3 dias',
    dueDate: 'Hoje (Vence em 3 dias)',
    dueDays: 3,
    status: 'hoje',
    value: 4320.00,
    amount: 4320.00,
    barcode: '8467000004322000283921002349001928374910'
  },
  {
    id: 'bill-2',
    supplier: 'Distribuidora Pet Farma Brasil',
    description: 'Antipulgas, Vermífugos e Shampoos',
    docNumber: 'Doc: #4510-A',
    dueDateText: 'Vence em 8 dias',
    dueDate: 'Em 8 dias',
    dueDays: 8,
    status: 'avencer',
    value: 1150.00,
    amount: 1150.00,
    barcode: '3419179001010435100092384729100293847592'
  },
  {
    id: 'bill-3',
    supplier: 'Moinho São Jorge',
    description: 'Milho Quebrado, Farelo e Quirera Granel',
    docNumber: 'Doc: #1092-G',
    dueDateText: 'Vence em 12 dias',
    dueDate: 'Em 12 dias',
    dueDays: 12,
    status: 'avencer',
    value: 890.00,
    amount: 890.00,
    barcode: '0019000009021938475829102938471928374619'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Total Alimentos / Grandfood do Brasil Ltda',
    tradeName: 'Premier Pet & Golden Fórmula',
    cnpj: '54.321.987/0001-45',
    category: 'racoes',
    categoryLabel: 'Rações & Nutrição Super Premium',
    contactName: 'Marcelo Santos (Repr. Regional Campinas)',
    phone: '(19) 3871-4400',
    whatsapp: '19998231144',
    email: 'pedidos@premierpetdistribuidora.com.br',
    paymentTerms: 'Boleto 28 / 35 / 42 DDL',
    deliveryDays: 'Toda Terça e Sexta',
    minOrderValue: 2000.00,
    brands: ['Premier Pet', 'Golden Fórmula', 'Nutrição Clínica'],
    suppliedProductsCount: 34,
    openOrdersCount: 1,
    rating: 4.9,
    notes: 'Entrega pontual em caminhão paletizado. Bonificação de 3% acima de R$ 5.000.',
    lastOrderDate: 'Há 3 dias'
  },
  {
    id: 'sup-2',
    name: 'Adimax Indústria e Comércio de Alimentos Ltda',
    tradeName: 'Adimax / Magnus Pet',
    cnpj: '48.912.345/0001-89',
    category: 'racoes',
    categoryLabel: 'Rações Premium & Especiais',
    contactName: 'Carlos Eduardo Ramos (Vendedor)',
    phone: '(15) 3285-9000',
    whatsapp: '15997543320',
    email: 'vendas.interior@adimax.com.br',
    paymentTerms: 'Boleto 21 / 28 DDL',
    deliveryDays: 'Toda Quarta-feira',
    minOrderValue: 1200.00,
    brands: ['Magnus Todo Dia', 'Fórmula Natural', 'Origens', 'Qualiday'],
    suppliedProductsCount: 28,
    openOrdersCount: 0,
    rating: 4.7,
    notes: 'Giro alto de sacarias de 15kg e 20kg. Fornece displays promocionais de ponto de venda.',
    lastOrderDate: 'Há 12 dias'
  },
  {
    id: 'sup-3',
    name: 'Moinho & Cerealista São Jorge Agro Ltda',
    tradeName: 'Cerealista São Jorge Grãos',
    cnpj: '61.234.567/0002-12',
    category: 'graos',
    categoryLabel: 'Grãos, Farelos & Rações de Postura',
    contactName: 'Benedito Silveira (Dep. Agrícola)',
    phone: '(19) 3521-8890',
    whatsapp: '19991824411',
    email: 'graos@moinhosaojorge.agr.br',
    paymentTerms: 'Boleto 15 / 30 DDL ou à vista c/ 5%',
    deliveryDays: 'Segunda e Quinta-feira',
    minOrderValue: 800.00,
    brands: ['Milho Moído São Jorge', 'Quirera de Milho', 'Farelo de Trigo', 'Girassol Miúdo', 'Ração Poedeira'],
    suppliedProductsCount: 18,
    openOrdersCount: 1,
    rating: 4.8,
    notes: 'Fornecedor dos baldes e tambores da área de granel. Sacas costuradas de 25kg e 50kg.',
    lastOrderDate: 'Há 5 dias'
  },
  {
    id: 'sup-4',
    name: 'Distribuidora Pet Farma Brasil Comércio Ltda',
    tradeName: 'Pet Farma Medicamentos & Vacinas',
    cnpj: '12.345.678/0001-90',
    category: 'farmacia',
    categoryLabel: 'Farmácia Veterinária & Antipulgas',
    contactName: 'Dra. Juliana Silveira (Consultora Técnica)',
    phone: '(11) 4004-9812',
    whatsapp: '11983217700',
    email: 'comercial@petfarmabrasil.com.br',
    paymentTerms: 'Boleto 30 / 60 DDL',
    deliveryDays: 'Toda Segunda e Quarta',
    minOrderValue: 900.00,
    brands: ['Zoetis (Simparic)', 'Bravecto (MSD)', 'NexGard', 'Drontal', 'Agener União'],
    suppliedProductsCount: 42,
    openOrdersCount: 1,
    rating: 5.0,
    notes: 'Distribuidor oficial com nota fiscal e lote rastreado de vacinas e antiparasitários.',
    lastOrderDate: 'Ontem'
  },
  {
    id: 'sup-5',
    name: 'Special Dog / Manfrim Alimentos S.A.',
    tradeName: 'Special Dog Alimentos',
    cnpj: '04.221.789/0001-33',
    category: 'racoes',
    categoryLabel: 'Rações Premium Cães & Gatos',
    contactName: 'Roberto Mendes (Supervisor)',
    phone: '(14) 3711-2000',
    whatsapp: '14996501122',
    email: 'pedidos.sp@specialdog.com.br',
    paymentTerms: 'Boleto 28 / 35 DDL',
    deliveryDays: 'Toda Sexta-feira',
    minOrderValue: 1500.00,
    brands: ['Special Dog Gold', 'Special Dog Prime', 'Special Cat Prime', 'Ultralife'],
    suppliedProductsCount: 22,
    openOrdersCount: 0,
    rating: 4.8,
    notes: 'Forte presença em cães adultos e sênior. Campanha de castrados com boa saída.',
    lastOrderDate: 'Há 18 dias'
  },
  {
    id: 'sup-6',
    name: 'Pet Clean Cosméticos & Estética Animal Ltda',
    tradeName: 'Pet Clean Professional & Acessórios',
    cnpj: '18.990.112/0001-76',
    category: 'higiene',
    categoryLabel: 'Shampoos, Banho & Tosa e Acessórios',
    contactName: 'Amanda Costa (Comercial)',
    phone: '(11) 3211-5500',
    whatsapp: '11992348899',
    email: 'comercial@petcleanprof.com.br',
    paymentTerms: 'Boleto 21 / 28 DDL ou PIX',
    deliveryDays: 'Toda Quinta-feira',
    minOrderValue: 600.00,
    brands: ['Pet Clean Profissional', 'K-Dog', 'Sanol Dog', 'Guias DogStar'],
    suppliedProductsCount: 30,
    openOrdersCount: 0,
    rating: 4.6,
    notes: 'Fornece os galões de 5L de shampoo hipoalergênico e toalhas para o setor de Banho & Tosa.',
    lastOrderDate: 'Há 8 dias'
  }
];

export const INITIAL_SUPPLIER_ORDERS: SupplierOrder[] = [
  {
    id: 'sord-1',
    orderNumber: '#PED-8821',
    supplierId: 'sup-1',
    supplierName: 'Premier Pet & Golden Fórmula',
    date: 'Hoje às 08:30',
    expectedDelivery: 'Amanhã (Terça) até 11h',
    status: 'faturado',
    itemsSummary: '10x Premier Raças Peq 15kg, 8x Golden Adultos 15kg, 12x Premier Gatos Castrados',
    totalValue: 3850.00,
    paymentTerm: 'Boleto 28/35/42 DDL',
    notes: 'Caminhão em rota interestadual. Nota Fiscal #49821 emitida.'
  },
  {
    id: 'sord-2',
    orderNumber: '#PED-8819',
    supplierId: 'sup-3',
    supplierName: 'Cerealista São Jorge Grãos',
    date: 'Ontem às 14:15',
    expectedDelivery: 'Quinta-feira',
    status: 'enviado',
    itemsSummary: '12 sacas Milho Quebrado (50kg), 6 sacas Farelo Trigo, 4 sacas Girassol',
    totalValue: 890.00,
    paymentTerm: 'Boleto 15/30 DDL',
    notes: 'Para reposição imediata dos tambores de granel que estão abaixo de 30%.'
  },
  {
    id: 'sord-3',
    orderNumber: '#PED-8815',
    supplierId: 'sup-4',
    supplierName: 'Pet Farma Medicamentos & Vacinas',
    date: 'Há 2 dias',
    expectedDelivery: 'Quarta-feira',
    status: 'cotacao',
    itemsSummary: '20 caixas Simparic 10-20kg, 15 caixas Simparic 20-40kg, 10 Drontal Plus',
    totalValue: 1450.00,
    paymentTerm: 'Boleto 30/60 DDL',
    notes: 'Aguardando confirmação de lote com validade estendida para 2026.'
  }
];

export interface RoleConfigItem {
  role: EmployeeUser['role'];
  label: string;
  description: string;
  badgeColor: string;
  icon: string;
  defaultPermissions: {
    canAccessFinance: boolean;
    canViewCostPrices: boolean;
    canViewGlobalSalesMetrics: boolean;
    canManageSuppliersCost: boolean;
    canCreateSupplierOrders: boolean;
    canCloseCashier: boolean;
    canApproveCredit: boolean;
    canApplySpecialDiscount: boolean;
    canModifySettings: boolean;
    canModifyMasterSettings: boolean;
    canAdjustInventoryLoss: boolean;
    maxDiscountPercent: number;
    allowRemoteAccess: boolean;
  };
}

export const ROLE_CONFIGS: Record<EmployeeUser['role'], RoleConfigItem> = {
  dono: {
    role: 'dono',
    label: 'Proprietário / Dono',
    description: 'Acesso irrestrito a todos os módulos, DRE, lucros, dados fiscais, compras de fábrica e gestão de equipe.',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: 'crown',
    defaultPermissions: {
      canAccessFinance: true,
      canViewCostPrices: true,
      canViewGlobalSalesMetrics: true,
      canManageSuppliersCost: true,
      canCreateSupplierOrders: true,
      canCloseCashier: true,
      canApproveCredit: true,
      canApplySpecialDiscount: true,
      canModifySettings: true,
      canModifyMasterSettings: true,
      canAdjustInventoryLoss: true,
      maxDiscountPercent: 100,
      allowRemoteAccess: true
    }
  },
  admin: {
    role: 'admin',
    label: 'Administrador TI / Matriz',
    description: 'Superusuário corporativo: parametrização, auditoria de segurança, telemetria e integração fiscal.',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: 'shield_person',
    defaultPermissions: {
      canAccessFinance: true,
      canViewCostPrices: true,
      canViewGlobalSalesMetrics: true,
      canManageSuppliersCost: true,
      canCreateSupplierOrders: true,
      canCloseCashier: true,
      canApproveCredit: true,
      canApplySpecialDiscount: true,
      canModifySettings: true,
      canModifyMasterSettings: true,
      canAdjustInventoryLoss: true,
      maxDiscountPercent: 100,
      allowRemoteAccess: true
    }
  },
  gerente: {
    role: 'gerente',
    label: 'Gerente da Loja',
    description: 'Supervisão da unidade: aprovação de descontos, compras com distribuidores, fechamento de caixa e estoques.',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: 'supervisor_account',
    defaultPermissions: {
      canAccessFinance: true,
      canViewCostPrices: true,
      canViewGlobalSalesMetrics: true,
      canManageSuppliersCost: true,
      canCreateSupplierOrders: true,
      canCloseCashier: true,
      canApproveCredit: true,
      canApplySpecialDiscount: true,
      canModifySettings: true,
      canModifyMasterSettings: false,
      canAdjustInventoryLoss: true,
      maxDiscountPercent: 20,
      allowRemoteAccess: true
    }
  },
  operador: {
    role: 'operador',
    label: 'Operador de Caixa (PDV)',
    description: 'Atendimento no caixa, pesagem de ração a granel, recebimentos e cupom fiscal. DRE e custos protegidos.',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: 'point_of_sale',
    defaultPermissions: {
      canAccessFinance: false,
      canViewCostPrices: false,
      canViewGlobalSalesMetrics: false,
      canManageSuppliersCost: false,
      canCreateSupplierOrders: false,
      canCloseCashier: false,
      canApproveCredit: false,
      canApplySpecialDiscount: false,
      canModifySettings: false,
      canModifyMasterSettings: false,
      canAdjustInventoryLoss: false,
      maxDiscountPercent: 5,
      allowRemoteAccess: false
    }
  },
  vendedor: {
    role: 'vendedor',
    label: 'Vendedor Balconista / Agro',
    description: 'Atendimento consultivo no balcão, recomendação de rações e medicamentos, cadastro de clientes e orçamentos.',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: 'support_agent',
    defaultPermissions: {
      canAccessFinance: false,
      canViewCostPrices: false,
      canViewGlobalSalesMetrics: false,
      canManageSuppliersCost: false,
      canCreateSupplierOrders: false,
      canCloseCashier: false,
      canApproveCredit: false,
      canApplySpecialDiscount: false,
      canModifySettings: false,
      canModifyMasterSettings: false,
      canAdjustInventoryLoss: false,
      maxDiscountPercent: 7,
      allowRemoteAccess: false
    }
  },
  tosador: {
    role: 'tosador',
    label: 'Esteticista Animal / Tosador',
    description: 'Execução de banho e tosa, táxi dog, atualização de status do pet e envio de avisos de conclusão via WhatsApp.',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: 'content_cut',
    defaultPermissions: {
      canAccessFinance: false,
      canViewCostPrices: false,
      canViewGlobalSalesMetrics: false,
      canManageSuppliersCost: false,
      canCreateSupplierOrders: false,
      canCloseCashier: false,
      canApproveCredit: false,
      canApplySpecialDiscount: false,
      canModifySettings: false,
      canModifyMasterSettings: false,
      canAdjustInventoryLoss: false,
      maxDiscountPercent: 5,
      allowRemoteAccess: false
    }
  },
  veterinario: {
    role: 'veterinario',
    label: 'Médico Veterinário / RT',
    description: 'Responsável Técnico: farmácia veterinária, vacinas, receituário e procedimentos clínicos do Pet Care.',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    icon: 'medical_services',
    defaultPermissions: {
      canAccessFinance: false,
      canViewCostPrices: false,
      canViewGlobalSalesMetrics: false,
      canManageSuppliersCost: false,
      canCreateSupplierOrders: false,
      canCloseCashier: false,
      canApproveCredit: false,
      canApplySpecialDiscount: false,
      canModifySettings: false,
      canModifyMasterSettings: false,
      canAdjustInventoryLoss: false,
      maxDiscountPercent: 10,
      allowRemoteAccess: true
    }
  }
};

export const AVAILABLE_AVATARS = [
  { id: 'av-1', label: 'Carlos (Gestão / Dono)', url: ASSETS.carlosEduardo },
  { id: 'av-2', label: 'Jorge (Gerência)', url: ASSETS.managerAvatar },
  { id: 'av-3', label: 'Beatriz (Administração TI)', url: ASSETS.profileAlt },
  { id: 'av-4', label: 'Mariana (Balcão / Caixa)', url: ASSETS.clientMaria },
  { id: 'av-5', label: 'Rafael (Pet Care / Balcão)', url: ASSETS.clientMarcos },
  { id: 'av-6', label: 'Camila (Veterinária / Pet Care)', url: ASSETS.clientCamila },
  { id: 'av-7', label: 'Antônio (Logística / Granel)', url: ASSETS.clientAntonio },
  { id: 'av-8', label: 'Dona Maria (Atendimento)', url: ASSETS.donaMaria }
];

export const INITIAL_EMPLOYEES: EmployeeUser[] = [
  {
    id: 'emp-admin',
    name: 'Dra. Beatriz Santos',
    email: 'beatriz.santos@globalpetagro.com.br',
    phone: '(19) 99870-1122',
    cpf: '284.910.842-19',
    role: 'admin',
    roleLabel: 'Administrador TI / Matriz',
    roleDescription: 'Superusuário Corporativo: Auditoria completa, segurança, simulação de acessos e parametrização do sistema.',
    avatar: ASSETS.profileAlt,
    pin: '9999',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    isActive: true,
    createdAt: '15/01/2024',
    workShift: {
      startTime: '08:00',
      endTime: '18:00',
      workDays: [1, 2, 3, 4, 5]
    },
    maxDiscountPercent: 100,
    allowRemoteAccess: true,
    canAccessFinance: true,
    canViewCostPrices: true,
    canViewGlobalSalesMetrics: true,
    canManageSuppliersCost: true,
    canCreateSupplierOrders: true,
    canCloseCashier: true,
    canApproveCredit: true,
    canApplySpecialDiscount: true,
    canModifySettings: true,
    canModifyMasterSettings: true,
    canAdjustInventoryLoss: true
  },
  {
    id: 'emp-1',
    name: 'Carlos Eduardo',
    email: 'carlos.diretoria@globalpetagro.com.br',
    phone: '(19) 98711-2099',
    cpf: '109.847.234-55',
    role: 'dono',
    roleLabel: 'Dono / Sócio-Proprietário',
    roleDescription: 'Acesso total irrestrito: DRE Contábil, Lucro Líquido, Pró-Labore, Chaves Bancárias e Patrimônio.',
    avatar: ASSETS.carlosEduardo,
    pin: '1234',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    isActive: true,
    createdAt: '01/01/2023',
    workShift: {
      startTime: '07:30',
      endTime: '19:00',
      workDays: [1, 2, 3, 4, 5, 6]
    },
    maxDiscountPercent: 100,
    allowRemoteAccess: true,
    canAccessFinance: true,
    canViewCostPrices: true,
    canViewGlobalSalesMetrics: true,
    canManageSuppliersCost: true,
    canCreateSupplierOrders: true,
    canCloseCashier: true,
    canApproveCredit: true,
    canApplySpecialDiscount: true,
    canModifySettings: true,
    canModifyMasterSettings: true,
    canAdjustInventoryLoss: true
  },
  {
    id: 'emp-2',
    name: 'Jorge Silva',
    email: 'jorge.gerente@globalpetagro.com.br',
    phone: '(19) 99123-4567',
    cpf: '342.119.876-02',
    role: 'gerente',
    roleLabel: 'Gerente Geral da Loja',
    roleDescription: 'Gestão da Unidade: Vendas, Custos de Mercadoria, Pedidos de Reposição, Fechamento de Caixa e Liberação de Alçada.',
    avatar: ASSETS.managerAvatar,
    pin: '2222',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    isActive: true,
    createdAt: '10/03/2023',
    workShift: {
      startTime: '07:45',
      endTime: '18:30',
      workDays: [1, 2, 3, 4, 5, 6]
    },
    maxDiscountPercent: 20,
    allowRemoteAccess: true,
    canAccessFinance: true,
    canViewCostPrices: true,
    canViewGlobalSalesMetrics: true,
    canManageSuppliersCost: true,
    canCreateSupplierOrders: true,
    canCloseCashier: true,
    canApproveCredit: true,
    canApplySpecialDiscount: true,
    canModifySettings: true,
    canModifyMasterSettings: false,
    canAdjustInventoryLoss: true
  },
  {
    id: 'emp-3',
    name: 'Mariana Souza',
    email: 'mariana.caixa@globalpetagro.com.br',
    phone: '(19) 99455-8899',
    cpf: '455.678.910-33',
    role: 'operador',
    roleLabel: 'Atendente & Caixa PDV',
    roleDescription: 'Frente de Loja: Vendas no PDV, Balança Toledo de Granel e Recebimentos de Clientes. Custos, margens e DRE bloqueados.',
    avatar: ASSETS.clientMaria,
    pin: '3333',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    isActive: true,
    createdAt: '01/08/2023',
    workShift: {
      startTime: '08:00',
      endTime: '17:00',
      workDays: [1, 2, 3, 4, 5, 6]
    },
    maxDiscountPercent: 5,
    allowRemoteAccess: false,
    canAccessFinance: false,
    canViewCostPrices: false,
    canViewGlobalSalesMetrics: false,
    canManageSuppliersCost: false,
    canCreateSupplierOrders: false,
    canCloseCashier: false,
    canApproveCredit: false,
    canApplySpecialDiscount: false,
    canModifySettings: false,
    canModifyMasterSettings: false,
    canAdjustInventoryLoss: false
  },
  {
    id: 'emp-4',
    name: 'Rafael Costa',
    email: 'rafael.petcare@globalpetagro.com.br',
    phone: '(19) 98822-3344',
    cpf: '512.334.887-90',
    role: 'tosador',
    roleLabel: 'Esteticista Animal & Tosador',
    roleDescription: 'Banho & Tosa, Táxi Dog, WhatsApp de tutores e apoio no PDV. Custos, margens e balanços de lucratividade bloqueados.',
    avatar: ASSETS.clientMarcos,
    pin: '4444',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    isActive: true,
    createdAt: '15/09/2023',
    workShift: {
      startTime: '08:30',
      endTime: '17:30',
      workDays: [1, 2, 3, 4, 5, 6]
    },
    maxDiscountPercent: 5,
    allowRemoteAccess: false,
    canAccessFinance: false,
    canViewCostPrices: false,
    canViewGlobalSalesMetrics: false,
    canManageSuppliersCost: false,
    canCreateSupplierOrders: false,
    canCloseCashier: false,
    canApproveCredit: false,
    canApplySpecialDiscount: false,
    canModifySettings: false,
    canModifyMasterSettings: false,
    canAdjustInventoryLoss: false
  },
  {
    id: 'emp-5',
    name: 'Dra. Camila Nogueira',
    email: 'dra.camila@globalpetagro.com.br',
    phone: '(19) 99812-4421',
    cpf: '338.992.110-44',
    role: 'veterinario',
    roleLabel: 'Médica Veterinária / RT (CRMV-SP 42.891)',
    roleDescription: 'Responsável Técnica: Farmácia Pet, Vacinas, Protocolos de Saúde e Orientações Técnicas ao Balcão.',
    avatar: ASSETS.clientCamila,
    pin: '5555',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    isActive: true,
    createdAt: '05/01/2024',
    workShift: {
      startTime: '09:00',
      endTime: '18:00',
      workDays: [1, 2, 3, 4, 5]
    },
    maxDiscountPercent: 10,
    allowRemoteAccess: true,
    canAccessFinance: false,
    canViewCostPrices: false,
    canViewGlobalSalesMetrics: false,
    canManageSuppliersCost: false,
    canCreateSupplierOrders: false,
    canCloseCashier: false,
    canApproveCredit: false,
    canApplySpecialDiscount: false,
    canModifySettings: false,
    canModifyMasterSettings: false,
    canAdjustInventoryLoss: false
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Global Pet & AgroRação',
  tradeName: 'Global Pet Comércio de Rações e Pet Shop Ltda',
  cnpj: '14.821.904/0001-38',
  phone: '(11) 98765-4321',
  pixKey: '14821904000138',
  defaultCreditLimit: 350.00,
  minStockAlertDays: 4,
  autoPrintReceipt: true,
  soundAlerts: true,
  quickWeights: [1, 2.5, 5, 10],
  defaultMarkupPercent: 45,
  whatsappMessageTemplate: 'Olá tutor! O seu pet {petName} está prontinho e super cheiroso aqui na Global Pet! 🐾✨'
};

// ----------------------------------------------------
// DADOS INICIAIS DO RAG & ATENDIMENTO INTELIGENTE
// ----------------------------------------------------

export const INITIAL_BOT_SETTINGS: BotSettings = {
  enabled: true,
  botName: 'Tobi - Assistente Global Pet',
  tone: 'caloroso',
  greetingMessage: 'Olá! Sou o Tobi, assistente virtual da Global Pet & AgroRação! 🐾 Como posso ajudar você e seu pet hoje? Temos rações fechadas e a granel, farmácia veterinária, banho & tosa e entregas rápidas na região!',
  businessHoursOnly: false,
  whatsappNumber: '(19) 99876-5432',
  deliveryFee: 7.00,
  freeDeliveryThreshold: 80.00,
  deliveryNeighborhoods: [
    'Centro',
    'Jardim das Flores',
    'Vila Nova',
    'Bela Vista',
    'Parque dos Pássaros',
    'Jardim São Paulo',
    'Residencial Primavera',
    'Zona Rural (Consulte Taxa)'
  ],
  pixKey: 'pix@globalpetagro.com.br',
  autoConfirmOrders: true,
  soundAlertOnNewLead: true,
  storeAddress: 'Av. Brasil, 1420 - Centro Comercial Agropecuário',
  faqCustomInfo: 'Horário de Funcionamento: Segunda a Sexta das 08:00 às 18:30, Sábados das 08:00 às 14:00. Banho e tosa requer agendamento prévio. Vacinação contra raiva e V10 atualizadas são obrigatórias para serviços no Pet Care. Aceitamos PIX com 5% de desconto à vista, cartões de crédito/débito e dinheiro com troco.'
};

export const INITIAL_ONLINE_ORDERS: OnlineOrder[] = [
  {
    id: 'ord-online-101',
    orderNumber: '#ON-2401',
    customerName: 'Fernanda Lima',
    customerPhone: '(19) 99881-2233',
    customerAddress: 'Rua das Acácias, 342, Apto 52',
    neighborhood: 'Jardim das Flores',
    petName: 'Thor',
    petBreedOrSize: 'Golden Retriever (Porte Grande)',
    items: [
      {
        productId: 'prod-premier-filhotes',
        name: 'Ração Premier Cães Filhotes Frango',
        quantity: 5,
        unit: 'KG',
        unitPrice: 28.50,
        totalPrice: 142.50,
        isGranel: true
      },
      {
        productId: 'prod-petisco-bifinho',
        name: 'Bifinho Keldog Carne 500g',
        quantity: 2,
        unit: 'UN',
        unitPrice: 18.90,
        totalPrice: 37.80,
        isGranel: false
      }
    ],
    subtotal: 180.30,
    deliveryFee: 0, // Frete grátis (> R$ 80)
    total: 180.30,
    paymentMethod: 'pix',
    status: 'em_separacao',
    source: 'whatsapp_bot',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    notes: 'Cliente pediu ração bem fresca do saco recém aberto. Chave PIX enviada no chat.',
    serviceType: 'produtos'
  },
  {
    id: 'ord-online-102',
    orderNumber: '#ON-2402',
    customerName: 'Rodrigo Mendonça',
    customerPhone: '(19) 99762-4411',
    customerAddress: 'Rua Quinze de Novembro, 880',
    neighborhood: 'Centro',
    petName: 'Mel',
    petBreedOrSize: 'Shih Tzu (Porte Pequeno)',
    items: [
      {
        name: 'Banho & Tosa Completa c/ Hidratação + Tosa Higiênica',
        quantity: 1,
        unit: 'SVC',
        unitPrice: 75.00,
        totalPrice: 75.00
      },
      {
        productId: 'prod-simparic-10kg',
        name: 'Simparic 20mg (Cães 5.1 a 10kg)',
        quantity: 1,
        unit: 'UN',
        unitPrice: 89.90,
        totalPrice: 89.90
      }
    ],
    subtotal: 164.90,
    deliveryFee: 0,
    total: 164.90,
    paymentMethod: 'cartao_entrega',
    status: 'pendente',
    source: 'whatsapp_bot',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    notes: 'Agendamento Pet Care para amanhã às 09:30 com Táxi Dog solicitado.',
    serviceType: 'misto'
  },
  {
    id: 'ord-online-103',
    orderNumber: '#ON-2403',
    customerName: 'Juliana Paes Costa',
    customerPhone: '(19) 99112-9988',
    customerAddress: 'Av. Paulista, 105',
    neighborhood: 'Vila Nova',
    petName: 'Mingau',
    petBreedOrSize: 'Gato Siamês',
    items: [
      {
        name: 'Ração Golden Gatos Castrados Salmão Granel',
        quantity: 2.5,
        unit: 'KG',
        unitPrice: 24.90,
        totalPrice: 62.25,
        isGranel: true
      },
      {
        name: 'Areia Sanitária Pipicat Floral 4kg',
        quantity: 1,
        unit: 'UN',
        unitPrice: 16.50,
        totalPrice: 16.50
      }
    ],
    subtotal: 78.75,
    deliveryFee: 7.00,
    total: 85.75,
    paymentMethod: 'dinheiro',
    changeFor: 100.00,
    status: 'saiu_entrega',
    source: 'whatsapp_bot',
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    notes: 'Troco para R$ 100,00 solicitado. Motoboy Carlinhos em rota.',
    serviceType: 'produtos'
  }
];

export const INITIAL_DEMO_CHAT_MESSAGES: BotChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'bot',
    text: 'Olá! Au-au e miau! 🐾 Sou o Tobi, assistente virtual inteligente da Global Pet & AgroRação. Como posso ajudar você e seu melhor amigo hoje?',
    timestamp: '14:20'
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Boa tarde! Vocês vendem ração para filhote a granel? E quanto custa o banho de um Golden?',
    timestamp: '14:21'
  },
  {
    id: 'msg-3',
    sender: 'bot',
    text: 'Boa tarde! Que alegria atender você! 🐕✨\n\nSim, temos rações Premium e Super Premium para filhotes a granel sempre fresquinhas no balcão:\n• Premier Cães Filhotes Frango: R$ 28,50/kg\n• Golden Formula Filhotes Carne: R$ 21,90/kg\n\nSobre o Banho & Tosa para Golden Retriever (Porte Grande):\n• Banho Completo: R$ 85,00 (inclui corte de unhas, limpeza de ouvidos e secagem com escovação)\n• Pacote com Tosa da Raça / Tosa Verão: R$ 120,00\n• Dispomos também de Táxi Dog para buscar e levar com segurança!\n\nGostaria de separar uma quantidade de ração ou agendar um horário para o seu Golden?',
    timestamp: '14:21',
    metadata: {
      ragSources: ['Produtos Granel: Premier Filhotes', 'Pet Care Tabela: Cães Porte Grande'],
      actionTaken: 'PRICE_QUOTED'
    }
  }
];
