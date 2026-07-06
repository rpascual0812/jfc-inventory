import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

import { Collapsible } from '@/components/ui/collapsible';
import FireStoreService from '@/services/FireStore';

type DropdownCategory = 'typeList' | 'productList' | 'unitOfMeasurementList' | 'storeCode';

type DropdownItem = {
    id: string;
    label: string;
    value: string;
};

const categories: Array<{ key: DropdownCategory; title: string; description: string }> = [
    { key: 'typeList', title: 'Type list', description: 'Manage transaction types shown in the product modal.' },
    { key: 'productList', title: 'Product list', description: 'Manage products available in the modal dropdown.' },
    { key: 'unitOfMeasurementList', title: 'Unit of measurement', description: 'Manage units shown in the modal.' },
    { key: 'storeCode', title: 'Store code', description: 'Manage store codes available for transfer entries.' },
];

export default function SettingScreen() {
    const [dropdownData, setDropdownData] = useState<Record<DropdownCategory, DropdownItem[]>>({
        typeList: [],
        productList: [],
        unitOfMeasurementList: [],
        storeCode: [],
    });
    const [drafts, setDrafts] = useState<Record<DropdownCategory, { label: string; value: string }>>({
        typeList: { label: '', value: '' },
        productList: { label: '', value: '' },
        unitOfMeasurementList: { label: '', value: '' },
        storeCode: { label: '', value: '' },
    });
    const [editingIds, setEditingIds] = useState<Record<DropdownCategory, string | null>>({
        typeList: null,
        productList: null,
        unitOfMeasurementList: null,
        storeCode: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLists = async () => {
            try {
                const service = FireStoreService();
                const nextData: Record<DropdownCategory, DropdownItem[]> = {
                    typeList: [],
                    productList: [],
                    unitOfMeasurementList: [],
                    storeCode: [],
                };

                for (const category of categories) {
                    const items = typeof service?.getDropdownItems === 'function'
                        ? await service.getDropdownItems(category.key)
                        : [];
                    nextData[category.key] = items;
                }

                setDropdownData(nextData);
            } catch (error) {
                console.error('Failed to load dropdown settings:', error);
            } finally {
                setLoading(false);
            }
        };

        loadLists();
    }, []);

    const updateDraft = (category: DropdownCategory, field: 'value', value: string) => {
        setDrafts((current) => ({
            ...current,
            [category]: {
                ...current[category],
                value,
            },
        }));
    };

    const resetDraft = (category: DropdownCategory) => {
        setDrafts((current) => ({
            ...current,
            [category]: { label: '', value: '' },
        }));
        setEditingIds((current) => ({
            ...current,
            [category]: null,
        }));
    };

    const handleEdit = (category: DropdownCategory, item: DropdownItem) => {
        setEditingIds((current) => ({ ...current, [category]: item.id }));
        setDrafts((current) => ({
            ...current,
            [category]: { label: item.label, value: item.value },
        }));
    };

    const handleSave = async (category: DropdownCategory) => {
        const draft = drafts[category];
        const value = draft.value.trim();

        if (!value) {
            Alert.alert('Missing value', 'Please enter a value.');
            return;
        }

        const service = FireStoreService();
        const currentItems = dropdownData[category];
        const baseSlug = slugify(value);
        let slug = baseSlug;
        let suffix = 1;

        while (currentItems.some((item) => item.id !== editingIds[category] && item.label === slug)) {
            slug = `${baseSlug}-${suffix}`;
            suffix += 1;
        }

        const updatedItems = await service.saveDropdownItem(category, {
            id: editingIds[category] || undefined,
            label: slug,
            value,
        });

        setDropdownData((current) => ({ ...current, [category]: updatedItems }));
        resetDraft(category);
    };

    const handleDelete = async (category: DropdownCategory, itemId: string) => {
        Alert.alert('Delete item', 'Remove this option from the dropdown?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    const service = FireStoreService();
                    const updatedItems = await service.deleteDropdownItem(category, itemId);
                    setDropdownData((current) => ({ ...current, [category]: updatedItems }));
                },
            },
        ]);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Manage the values used in the product entry form.</Text>

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 24 }} />
            ) : (
                categories.map((category) => (
                    <Collapsible key={category.key} title={category.title}>
                        <View style={styles.sectionContent}>
                            <Text style={styles.description}>{category.description}</Text>

                            {dropdownData[category.key].length === 0 ? (
                                <Text style={styles.emptyState}>No items saved yet.</Text>
                            ) : (
                                dropdownData[category.key].map((item) => (
                                    <View key={item.id} style={styles.itemRow}>
                                                <View style={styles.itemTextWrap}>
                                                    <Text style={styles.itemValueHighlighted}>{item.value}</Text>
                                                    <Text style={styles.itemSlug}>{item.label}</Text>
                                                </View>
                                        <View style={styles.itemActions}>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                onPress={() => handleEdit(category.key, item)}
                                            >
                                                <Text style={styles.actionText}>Edit</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.actionButton, styles.deleteButton]}
                                                onPress={() => handleDelete(category.key, item.id)}
                                            >
                                                <Text style={styles.actionText}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}

                            <View style={styles.formBox}>
                                <Text style={styles.helperText}>
                                    Enter the value. A unique slug will be generated automatically.
                                </Text>
                                <TextInput
                                    placeholder="Value"
                                    value={drafts[category.key].value}
                                    onChangeText={(value) => updateDraft(category.key, 'value', value)}
                                    style={styles.input}
                                />

                                <View style={styles.formActions}>
                                    <TouchableOpacity style={styles.primaryButton} onPress={() => handleSave(category.key)}>
                                        <Text style={styles.primaryButtonText}>
                                            {editingIds[category.key] ? 'Update' : 'Add'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.secondaryButton} onPress={() => resetDraft(category.key)}>
                                        <Text style={styles.secondaryButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Collapsible>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    sectionContent: {
        gap: 10,
    },
    description: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    emptyState: {
        fontSize: 13,
        color: '#888',
        fontStyle: 'italic',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ddd',
        gap: 8,
    },
    itemTextWrap: {
        flex: 1,
    },
    itemLabel: {
        fontWeight: '600',
        fontSize: 14,
    },
    itemValue: {
        fontSize: 12,
        color: '#666',
    },
    itemValueHighlighted: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
    },
    itemSlug: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    itemActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#e8f0fe',
    },
    deleteButton: {
        backgroundColor: '#fde8e8',
    },
    actionText: {
        fontSize: 12,
        color: '#1a73e8',
    },
    formBox: {
        marginTop: 6,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f6f6f6',
        gap: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fff',
    },
    formActions: {
        flexDirection: 'row',
        gap: 8,
    },
    primaryButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    secondaryButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    secondaryButtonText: {
        color: '#666',
    },
});
