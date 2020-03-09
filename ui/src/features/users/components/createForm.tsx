import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Button,
    FormGroup,
    InputGroup,
} from "@blueprintjs/core";
import {Realm, NewUser} from "../../../types";

interface props {
    realm: Realm|null;
    onSave: (realm: Realm, user: NewUser) => Promise<any>;
    isSaving: boolean;
    error: string|null;
}
function CreateForm({realm, onSave, isSaving, error}: props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async () => {
        await onSave(realm!, {
            username,
            password,
        });
    };
    useEffect(() => {
        if (!isSaving && !error) {
            setUsername('');
            setPassword('');
        }
    }, [isSaving, error]);
    if (realm === null) {
        return null;
    }
    return (
        <>
            <FormGroup
                helperText="Typically the user's email address"
                label="Username"
                labelFor="username"
                labelInfo="(required)"
            >
                <InputGroup id="username" placeholder="Username" value={username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}/>
            </FormGroup>
            <FormGroup
                label="Password"
                labelFor="password"
                labelInfo="(required)"
            >
                <InputGroup type="password" id="password" placeholder="Password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
            </FormGroup>
            <Button loading={isSaving} disabled={username === ''} icon="user" text="Create User" onClick={handleSubmit}/>
        </>
    );
}

export default CreateForm;
