import json
from channels.generic.websocket import AsyncWebsocketConsumer

class InventoryConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "inventory_updates"

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message')
        type = text_data_json.get('type')

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'inventory_message',
                'message': message,
                'msg_type': type
            }
        )

    # Receive message from room group
    async def inventory_message(self, event):
        message = event['message']
        msg_type = event['msg_type']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'type': msg_type
        }))
