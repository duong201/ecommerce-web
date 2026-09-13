export type SlideTone = 'lime' | 'amber' | 'rose' | 'indigo'

export interface SlideData {
  id: string
  href: string
  coverImg: string
  tone: SlideTone
}

const Sdata: SlideData[] = [
  {
    id: 'box',
    href: '/san-pham',
    coverImg: '/images/SlideCard/slide-1.jpg',
    tone: 'lime',
  },
  {
    id: 'mango',
    href: '/tim-kiem?q=xo%C3%A0i',
    coverImg: '/images/SlideCard/slide-2.jpg',
    tone: 'amber',
  },
  {
    id: 'organic',
    href: '/tim-kiem?isOrganic=true',
    coverImg: '/images/SlideCard/slide-3.jpg',
    tone: 'rose',
  },
  {
    id: 'delivery',
    href: '/san-pham',
    coverImg: '/images/SlideCard/slide-4.jpg',
    tone: 'indigo',
  },
]

export default Sdata
