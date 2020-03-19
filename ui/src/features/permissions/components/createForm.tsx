import React, {useEffect, useState} from 'react';
import {
    Button,
    FormGroup,
    InputGroup,
    TextArea,
} from "@blueprintjs/core";
import {NewPermission, Realm} from "../../../types";

interface props {
    onSave: (permission: Omit<NewPermission, "realmId">) => Promise<any>;
    isSaving: boolean;
    error: string|null;
    realm: Realm|null;
}
function CreateForm({onSave, isSaving, error, realm}: props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const handleSubmit = async () => {
        await onSave({
            name,
            description
        });
    };
    useEffect(() => {
        if (!isSaving && !error) {
            setName('');
            setDescription('');
        }
    }, [isSaving, error]);
    if (!realm) return null;
    return (
        <>
            <FormGroup
                helperText="The name of the permission"
                label="Permission"
                labelFor="permission"
                labelInfo="(required)"
            >
                <InputGroup id="permission" placeholder="Permission Name" value={name} onChange={(e: any) => setName(e.target.value)}/>
            </FormGroup>
            <FormGroup
                helperText="A description of the permission"
                label="Description"
                labelFor="description"
            >
                <TextArea id="description" fill={true} value={description} onChange={(e: any) => setDescription(e.target.value)}/>
            </FormGroup>
            <Button loading={isSaving} disabled={name === ''} icon="people" text="Create Permission" onClick={handleSubmit}/>
        </>
    );
}

export default CreateForm;
