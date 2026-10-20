import { SectionPage } from '../../section-page';
import { FormEditor } from './form-editor';

export default function FormPage({ params }: { params: Promise<{ region: string }> }) {
    return (
        <SectionPage
            params={params}
            render={(c, region) => (
                <FormEditor
                    key={region}
                    region={region}
                    initial={c.form}
                />
            )}
        />
    );
}
