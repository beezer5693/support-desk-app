import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTicket, closeTicket } from '../features/tickets/ticketSlice';
import { getNotes, createNote } from '../features/notes/noteSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import NoteItem from '../components/NoteItem';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const customStyles = {
	content: {
		width: '600px',
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -100%)',
		position: 'relative'
	}
};

Modal.setAppElement('#root');

function Ticket() {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [noteText, setNoteText] = useState('');

	const { ticket, isLoading, isError, message } = useSelector(
		state => state.tickets
	);
	const { notes, isLoading: notesIsLoading } = useSelector(
		state => state.notes
	);

	const params = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}

		dispatch(getTicket(params.ticketId));
		dispatch(getNotes(params.ticketId));
		setNoteText('');
	}, [isError, message, params.ticketId]);

	// Close ticket
	const onTicketClose = () => {
		dispatch(closeTicket(params.ticketId));
		toast.success(`Ticket ${params.ticketId}, has been closed successfully`);
		navigate('/tickets');
	};

	// Open/close modal
	const openModal = () => setModalIsOpen(true);
	const closeModal = () => setModalIsOpen(false);

	// Create note
	const onNoteSubmit = e => {
		e.preventDefault();
		dispatch(createNote({ noteText, ticketId: params.ticketId }));
		setNoteText('');
		closeModal();
	};

	if (isLoading || notesIsLoading) {
		return <Spinner />;
	}

	if (isError) {
		return <h3>Something went wrong.</h3>;
	}

	return (
		<div className='ticket-page'>
			<header className='ticket-header'>
				<BackButton url='/tickets' />
				<h2>
					Ticket ID: {ticket._id}
					<span className={`status status-${ticket.status}`}>
						{ticket.status}
					</span>
				</h2>
				<h3>
					Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}
				</h3>
				<h3>Device: {ticket.product}</h3>
				<hr />
				<div className='ticket-desc'>
					<h3>Description of Issue</h3>
					<p>{ticket.description}</p>
				</div>
				<h2>Notes</h2>
			</header>
			{ticket.status !== 'closed' && (
				<button className='btn' onClick={openModal}>
					<FaPlus /> Add Note
				</button>
			)}

			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel='Add Note'
			>
				<h2>Add Note</h2>
				<button className='btn-close' onClick={closeModal}>
					X
				</button>
				<form onSubmit={onNoteSubmit}>
					<div className='form-group'>
						<textarea
							name='noteText'
							id='noteText'
							className='form-control'
							placeholder='Note text'
							value={noteText}
							onChange={e => setNoteText(e.target.value)}
						></textarea>
					</div>
					<div className='form-group'>
						<button type='submit' className='btn'>
							Submit
						</button>
					</div>
				</form>
			</Modal>

			{notes.map(note => (
				<NoteItem key={note._id} note={note} />
			))}

			{ticket.status !== 'closed' && (
				<button className='btn btn-block btn-danger' onClick={onTicketClose}>
					Close Ticket
				</button>
			)}
		</div>
	);
}

export default Ticket;
