from rest_framework import serializers
from .models import Invoice, LineItem

class LineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineItem
        fields = ['id', 'description', 'quantity', 'price']

class InvoiceSerializer(serializers.ModelSerializer):
    items = LineItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'customer_name', 'customer_email', 'created_at', 'subtotal', 'tax', 'total', 'status', 'items']

    def create(self, validated_data):
        items_data = self.initial_data.get('items', [])
        invoice = Invoice.objects.create(**validated_data)

        subtotal = 0

        for item_data in items_data:
            item = LineItem.objects.create(invoice=invoice, **item_data)
            subtotal += item.quantity * item.price

        tax = subtotal * 0.18
        total = subtotal + tax

        invoice.subtotal = subtotal
        invoice.tax = tax
        invoice.total = total
        invoice.save()

        return invoice

    def update(self, instance, validated_data):
        # Prevent reverting from Paid to Pending (one-way flow)
        new_status = validated_data.get('status', instance.status)
        
        if instance.status == 'paid' and new_status == 'pending':
            raise serializers.ValidationError(
                {"status": "Cannot revert a paid invoice back to pending. Paid invoices are final."}
            )
        
        instance.status = new_status
        instance.save()
        return instance