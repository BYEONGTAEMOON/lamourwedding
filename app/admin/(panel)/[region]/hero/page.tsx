import heroImage from '@/public/assets/hero.png';
import { SectionPage } from '../../section-page';
import { HeroEditor } from './hero-editor';

export default function HeroPage({ params }: { params: Promise<{ region: string }> }) {
    return (
        <SectionPage
            params={params}
            render={(c, region) => (
                <HeroEditor
                    key={region}
                    region={region}
                    initial={c.hero}
                    defaultSrc={heroImage.src}
                />
            )}
        />
    );
}
