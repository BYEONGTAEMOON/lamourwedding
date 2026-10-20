import { SectionPage } from '../../section-page';
import { PartnersEditor } from './partners-editor';

export default function PartnersPage({ params }: { params: Promise<{ region: string }> }) {
    return (
        <SectionPage
            params={params}
            render={(c, region) => (
                <PartnersEditor
                    key={region}
                    region={region}
                    initial={c.partners}
                />
            )}
        />
    );
}
