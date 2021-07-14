import {Options, Vue} from 'vue-class-component';
import {useStore} from "@/store";
@Options({})
export default class Login extends Vue {
    private appElement: HTMLElement | null = null;
    private store = useStore();

    public has_error = false;
    public error_message = "";

    public credentials = {
        username: "",
        password: "",
        grant_type:process.env.VUE_APP_GRANT_TYPE,
        client_id: process.env.VUE_APP_CLIENT_ID,
        client_secret: process.env.VUE_APP_CLIENT_SECRET

    }

    public mounted(): void {
        this.appElement = document.getElementById('app') as HTMLElement;
        this.appElement.classList.add('login-page');
    }

    public unmounted(): void {
        (this.appElement as HTMLElement).classList.remove('login-page');
    }

    public async login(): Promise<void>{
        try{
            await this.store.dispatch("authenticate",this.credentials)
            window.location.href = "/"
        }
        catch (e)
        {
            this.has_error = true;
            this.error_message = e.message
        }
    }

    public dismissError(){
        this.has_error = false;
    }


}
