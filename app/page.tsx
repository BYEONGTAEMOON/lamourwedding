import type { Metadata } from 'next';
import { Landing } from './_components/landing';

export const metadata: Metadata = {
    title: '대구 웨딩박람회 | 라모르',
};

export default function Home() {
    return <Landing region="daegu" />;
}
