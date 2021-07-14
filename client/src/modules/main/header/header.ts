import {Options, Vue} from 'vue-class-component';
import Messages from './messages/messages.vue';
import Notifications from './notifications/notifications.vue';
import Languages from './languages/languages.vue';
import User from './user/user.vue';
import {useStore} from "@/store";

@Options({
    components: {
        'messages-dropdown': Messages,
        'notifications-dropdown': Notifications,
        'languages-dropdown': Languages,
        'user-dropdown': User
    }
})
export default class Header extends Vue {
    private store = useStore();
    public onToggleMenuSidebar(): void {
        this.$emit('toggle-menu-sidebar');
    }

    public logout():void{
        this.store.dispatch("de_authenticate")
        window.location.href = '/login';
    }
}
