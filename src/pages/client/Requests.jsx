import { api } from '@/api';
import { LocalStorage } from '@/api/utilities';
import { doFetch } from '@/api/utilities/doFetch';
import { Divider } from '@/components/Divider';
import { Empty } from '@/components/Empty';
import { Logo } from '@/components/Logo';
import { RequestTable } from '@/components/Request';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export async function loader() {
	try {
		const response = await doFetch({
			endpoint: api.v1.requests.findAll,
		});

		return response.data.payload;
	} catch (error) {
		if (!error.toasted) {
			throw error;
		}
	}
}

export function Requests() {
	const navigateTo = useNavigate();
	const requests = useLoaderData();

	const isEmpty = requests.length === 0;

	const signOutHandler = () => {
		LocalStorage.signOut();

		toast('Sesión cerrada!', {
			draggable: false,
			closeButton: false,
			type: 'success',
			position: 'bottom-left',
		});

		navigateTo('/auth/sign-in');
	};

	return (
		<section className="flex flex-col items-center justify-center px-6 py-8 h-screen">
			<div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-3xl">
				<div className="flex flex-col p-8 space-y-4">
					<div className="flex w-full justify-between">
						<h1 className="flex align-center text-2xl text-gray-900">
							<Logo spin /> &nbsp; - Solicitudes
						</h1>
						<span
							className="pt-2 text-red-500 italic cursor-pointer hover:underline"
							onClick={signOutHandler}
						>
							Cerrar sesi&oacute;n
						</span>
					</div>
					<Divider />
					<div className="flex flex-col space-y-8">
						<span className="ml-4 pt-2 text-indigo-600 italic cursor-pointer hover:underline">
							Añadir solicitud
						</span>

						{isEmpty ? <Empty /> : <RequestTable requests={requests} />}
					</div>

					<Divider />
				</div>
			</div>
		</section>
	);
}
