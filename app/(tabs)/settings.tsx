import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import FireStoreService from '@/services/FireStore';

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

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

    const updateDraft = (category: DropdownCategory, value: string) => {
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
                <ActivityIndicator size="large" style={styles.loader} />
            ) : (
                categories.map((category) => (
                    <Collapsible key={category.key} title={category.title}>
                        <View style={styles.sectionContent}>
                            <Text style={styles.description}>{category.description}</Text>

                            {dropdownData[category.key].length === 0 ? (
                                <Text style={styles.emptyState}>No saved values yet.</Text>
                            ) : (
                                dropdownData[category.key].map((item) => (
                                    <View key={item.id} style={styles.itemRow}>
                                        <View style={styles.itemTextWrap}>
                                            <Text style={styles.itemValueHighlighted}>{item.value}</Text>
                                            <Text style={styles.itemSlug}>{item.label}</Text>
                                        </View>
                                        <View style={styles.itemActions}>
                                            <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(category.key, item)}>
                                                <Text style={styles.actionText}>Edit</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDelete(category.key, item.id)}>
                                                <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}

                            <View style={styles.formBox}>
                                <Text style={styles.helperText}>Enter the display name for the dropdown item. The slug is generated automatically.</Text>
                                <TextInput
                                    placeholder="Value"
                                    placeholderTextColor="#94A3B8"
                                    value={drafts[category.key].value}
                                    onChangeText={(value) => updateDraft(category.key, value)}
                                    style={styles.input}
                                />

                                <View style={styles.formActions}>
                                    <TouchableOpacity style={styles.primaryButton} onPress={() => handleSave(category.key)}>
                                        <Text style={styles.primaryButtonText}>{editingIds[category.key] ? 'Update' : 'Add'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.secondaryButton} onPress={() => resetDraft(category.key)}>
                                        <Text style={styles.secondaryButtonText}>Clear</Text>
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
        flexGrow: 1,
        padding: 24,
        paddingBottom: 40,
        backgroundColor: '#F4F7FB',
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#475569',
        marginBottom: 20,
        lineHeight: 22,
        maxWidth: '92%',
    },
    loader: {
        marginTop: 24,
    },
    sectionContent: {
        gap: 14,
    },
    description: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 10,
    },
    helperText: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 10,
    },
    emptyState: {
        fontSize: 13,
        color: '#94A3B8',
        fontStyle: 'italic',
        paddingVertical: 10,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 2,
        gap: 14,
    },
    itemTextWrap: {
        flex: 1,
    },
    itemValueHighlighted: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    itemSlug: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
    },
    itemActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: '#F8FAFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    deleteButton: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
    },
    actionText: {
        fontSize: 12,
        color: '#0F4C81',
        fontWeight: '700',
    },
    deleteText: {
        color: '#B91C1C',
    },
    formBox: {
        marginTop: 16,
        padding: 18,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#F8FAFF',
        color: '#0F172A',
    },
    formActions: {
        flexDirection: 'row',
        gap: 12,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: '#0F4C81',
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    secondaryButton: {
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: '#475569',
        fontWeight: '700',
        fontSize: 14,
    },
});
