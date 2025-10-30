--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-04-26 09:58:28

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 874 (class 1247 OID 25063)
-- Name: bookingstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.bookingstatus AS ENUM (
    'PENDING',
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public.bookingstatus OWNER TO postgres;

--
-- TOC entry 877 (class 1247 OID 25072)
-- Name: registrationstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.registrationstatus AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public.registrationstatus OWNER TO postgres;

--
-- TOC entry 868 (class 1247 OID 25032)
-- Name: userrole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.userrole AS ENUM (
    'homeowners',
    'serviceproviders',
    'admin'
);


ALTER TYPE public.userrole OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 25143)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    user_id integer,
    is_super_admin boolean
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25142)
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO postgres;

--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 227
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- TOC entry 220 (class 1259 OID 24994)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    service_id integer,
    homeowner_id integer,
    booking_date timestamp without time zone,
    status character varying,
    scheduled_date timestamp without time zone,
    completed_date timestamp without time zone
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24993)
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO postgres;

--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 219
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- TOC entry 222 (class 1259 OID 25014)
-- Name: homeowners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.homeowners (
    id integer NOT NULL,
    user_id integer,
    address character varying
);


ALTER TABLE public.homeowners OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25013)
-- Name: homeowners_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.homeowners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.homeowners_id_seq OWNER TO postgres;

--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 221
-- Name: homeowners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.homeowners_id_seq OWNED BY public.homeowners.id;


--
-- TOC entry 218 (class 1259 OID 24943)
-- Name: provider_registration_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provider_registration_requests (
    id integer NOT NULL,
    full_name character varying NOT NULL,
    email character varying NOT NULL,
    phone_number character varying,
    address character varying,
    years_experience integer,
    password_hash character varying NOT NULL,
    id_verification character varying,
    certification character varying,
    status character varying NOT NULL,
    rejection_reason character varying,
    requested_at timestamp without time zone,
    processed_at timestamp without time zone,
    processed_by integer
);


ALTER TABLE public.provider_registration_requests OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24942)
-- Name: provider_registration_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.provider_registration_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.provider_registration_requests_id_seq OWNER TO postgres;

--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 217
-- Name: provider_registration_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.provider_registration_requests_id_seq OWNED BY public.provider_registration_requests.id;


--
-- TOC entry 224 (class 1259 OID 25040)
-- Name: serviceproviders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.serviceproviders (
    id integer NOT NULL,
    user_id integer,
    business_name character varying,
    address character varying,
    years_experience integer,
    service_description character varying,
    id_verification character varying,
    certification character varying,
    is_verified boolean,
    verification_date timestamp without time zone,
    verification_by integer
);


ALTER TABLE public.serviceproviders OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25039)
-- Name: serviceproviders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.serviceproviders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.serviceproviders_id_seq OWNER TO postgres;

--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 223
-- Name: serviceproviders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.serviceproviders_id_seq OWNED BY public.serviceproviders.id;


--
-- TOC entry 230 (class 1259 OID 25341)
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id integer NOT NULL,
    provider_id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    price integer,
    image character varying,
    rating integer DEFAULT 0,
    provider_name character varying,
    created_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    is_active boolean DEFAULT true
);


ALTER TABLE public.services OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 25340)
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO postgres;

--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 229
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- TOC entry 226 (class 1259 OID 25132)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    full_name character varying NOT NULL,
    phone_number character varying,
    profile_image character varying,
    is_active boolean,
    role public.userrole NOT NULL,
    created_at timestamp without time zone,
    last_login timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25131)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 225
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4685 (class 2604 OID 25146)
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- TOC entry 4681 (class 2604 OID 24997)
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- TOC entry 4682 (class 2604 OID 25017)
-- Name: homeowners id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.homeowners ALTER COLUMN id SET DEFAULT nextval('public.homeowners_id_seq'::regclass);


--
-- TOC entry 4680 (class 2604 OID 24946)
-- Name: provider_registration_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_registration_requests ALTER COLUMN id SET DEFAULT nextval('public.provider_registration_requests_id_seq'::regclass);


--
-- TOC entry 4683 (class 2604 OID 25043)
-- Name: serviceproviders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serviceproviders ALTER COLUMN id SET DEFAULT nextval('public.serviceproviders_id_seq'::regclass);


--
-- TOC entry 4686 (class 2604 OID 25344)
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- TOC entry 4684 (class 2604 OID 25135)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4879 (class 0 OID 25143)
-- Dependencies: 228
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, user_id, is_super_admin) FROM stdin;
1	1	t
2	2	f
\.


--
-- TOC entry 4871 (class 0 OID 24994)
-- Dependencies: 220
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, service_id, homeowner_id, booking_date, status, scheduled_date, completed_date) FROM stdin;
\.


--
-- TOC entry 4873 (class 0 OID 25014)
-- Dependencies: 222
-- Data for Name: homeowners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.homeowners (id, user_id, address) FROM stdin;
\.


--
-- TOC entry 4869 (class 0 OID 24943)
-- Dependencies: 218
-- Data for Name: provider_registration_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provider_registration_requests (id, full_name, email, phone_number, address, years_experience, password_hash, id_verification, certification, status, rejection_reason, requested_at, processed_at, processed_by) FROM stdin;
10	Ameha Seyoum	ameha@gmail.com	+251923790730	123 street, united kingdom	5	$2b$12$uDhRZrhThT/5dMDPidzb3eBdBlBSvqmKPEbJ/3KJAEPIIrX7zgkP2	\N	\N	REJECTED	Insufficient documentation	2025-04-12 17:16:26.614472	2025-04-24 13:41:08.469833	9
7	John Dalton	johndalton@gmail.com	+120934400	123 street, united kingdom	8	$2b$12$xOd23gqUxziFNv4lOUGLwOQoPs.Xjf0h8MKx7VjEUQtbA.8OmGXzq	\N	\N	REJECTED	Insufficient documentation	2025-04-11 10:49:40.635403	2025-04-24 13:41:10.850128	9
11	aaron	aaron@gmail.com	+25193484548	123 street, united kingdom	15	$2b$12$BnnJlKD3pXZEuzWD9a.V0OT5ybJHqJOrPY7BpEIHykD.MjCapMLsa	\N	\N	REJECTED	Insufficient documentation	2025-04-12 19:14:12.114282	2025-04-24 13:41:11.988065	9
12	string	string	string	string	0	$2b$12$dm6LLKBAjptzfDXr8ijfLOomKsr5Ydy4dzBge6hCN6ciGpftpOQ9y	static/uploads/c02870a2-f6cf-440a-9521-3a15fdc56b1c.pdf	static/uploads/4fc64eb1-9eca-4a27-a8de-16dfb0d7775f.pdf	REJECTED	Insufficient documentation	2025-04-24 14:07:30.259403	2025-04-24 14:11:22.194553	9
13	Lidya Seyoum	lidya@gmail.com	+1233123844	Atlanta, Addis Ababa	16	$2b$12$hka4CX43aMcK4WaMhmOxienEnzf6eEimu9800OO9WEx6SWpOHFgT6	static/uploads/d0428b85-aae3-4bb6-90bc-014e115fe3ba.pdf	static/uploads/69bc137e-33d3-4b08-af48-cd9f653ee638.pdf	APPROVED	\N	2025-04-24 14:20:08.946483	2025-04-24 14:35:53.373323	2
14	Donald Trump	trump@donald.com	+1123131313	white house, Washington DC	87	$2b$12$EdBDUTcFntTP2XE4t2NRdeXjXiSsNKLTNB35UYn6oGP.TfQRc1U3G	static/uploads/cefa8e96-8525-4b56-a74e-73a07a2858df.png	static/uploads/bdc0b043-e035-491e-b3f0-4e5c79c8a09e.png	APPROVED	\N	2025-04-24 15:02:25.950127	2025-04-24 15:58:25.849522	9
16	Balew	balew@gmail.com	+34923992992	lideta	14	$2b$12$KDiglrcp4awUzufvRt7eUuMMYfVfTNWp/UZqoyldEIyGOTTFx7it2	static/uploads/0a24c5f2-d00c-4064-86f5-b54dc909474e.png	static/uploads/9f2911c1-c059-47ed-acd8-282761e0473e.png	APPROVED	\N	2025-04-25 19:14:43.82407	2025-04-25 19:42:21.137459	9
15	Aaron the plumber	aaron@plumber.com	+251923790730	123 street, united kingdom	5	$2b$12$/Wvo4jJglXpghmDZPx1NTuqeLAwVF98cZj4oXhROkpTj2drWUimP2	\N	\N	REJECTED	Insufficient documentation	2025-04-25 18:09:19.505377	2025-04-25 19:42:25.270435	9
\.


--
-- TOC entry 4875 (class 0 OID 25040)
-- Dependencies: 224
-- Data for Name: serviceproviders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.serviceproviders (id, user_id, business_name, address, years_experience, service_description, id_verification, certification, is_verified, verification_date, verification_by) FROM stdin;
\.


--
-- TOC entry 4881 (class 0 OID 25341)
-- Dependencies: 230
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, provider_id, title, description, price, image, rating, provider_name, created_at, is_active) FROM stdin;
\.


--
-- TOC entry 4877 (class 0 OID 25132)
-- Dependencies: 226
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, full_name, phone_number, profile_image, is_active, role, created_at, last_login) FROM stdin;
1	homehelp@connect.com	$2b$12$nxuMkal8P6Z8alAYTMUd6OD1gcEd/VvUsZdo.IcRSTgbUG7usP/CK	Super Admin	\N	\N	t	admin	2025-04-12 11:18:47.676511	\N
2	admin@homehelp.com	$2b$12$RifAkl6W7X1zE6E1/eJPeesvp27Ra5bAiTtkT4LQGqSVTU1NDwvLS	admin	\N	\N	t	admin	2025-04-12 11:43:12.715769	\N
7	ameha@seyoum.admin	$2b$12$myVELca1mOcuu//9vw4Ww.o/cHS3r6GbcQ3Nx2.gplvpd4pmQAZn.	amex	\N	\N	t	admin	2025-04-17 20:26:09.092024	\N
9	admin@homehelp.connect	$2b$12$wiXC2L7AFB3ilO8QmB.sAe7Scfa2fM30gJz6aS3RNcLMYtO7heagG	homehelpadmin	\N	\N	t	admin	2025-04-23 16:30:01.085219	\N
\.


--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 227
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 4, true);


--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 219
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_id_seq', 1, false);


--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 221
-- Name: homeowners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.homeowners_id_seq', 5, true);


--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 217
-- Name: provider_registration_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.provider_registration_requests_id_seq', 16, true);


--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 223
-- Name: serviceproviders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.serviceproviders_id_seq', 9, true);


--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 229
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 4, true);


--
-- TOC entry 4900 (class 0 OID 0)
-- Dependencies: 225
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 21, true);


--
-- TOC entry 4713 (class 2606 OID 25148)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 4715 (class 2606 OID 25150)
-- Name: admins admins_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);


--
-- TOC entry 4696 (class 2606 OID 25001)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- TOC entry 4699 (class 2606 OID 25021)
-- Name: homeowners homeowners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.homeowners
    ADD CONSTRAINT homeowners_pkey PRIMARY KEY (id);


--
-- TOC entry 4701 (class 2606 OID 25023)
-- Name: homeowners homeowners_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.homeowners
    ADD CONSTRAINT homeowners_user_id_key UNIQUE (user_id);


--
-- TOC entry 4692 (class 2606 OID 24952)
-- Name: provider_registration_requests provider_registration_requests_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_registration_requests
    ADD CONSTRAINT provider_registration_requests_email_key UNIQUE (email);


--
-- TOC entry 4694 (class 2606 OID 24950)
-- Name: provider_registration_requests provider_registration_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_registration_requests
    ADD CONSTRAINT provider_registration_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4705 (class 2606 OID 25047)
-- Name: serviceproviders serviceproviders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serviceproviders
    ADD CONSTRAINT serviceproviders_pkey PRIMARY KEY (id);


--
-- TOC entry 4707 (class 2606 OID 25049)
-- Name: serviceproviders serviceproviders_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serviceproviders
    ADD CONSTRAINT serviceproviders_user_id_key UNIQUE (user_id);


--
-- TOC entry 4720 (class 2606 OID 25351)
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- TOC entry 4711 (class 2606 OID 25139)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4717 (class 1259 OID 25358)
-- Name: idx_services_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_services_is_active ON public.services USING btree (is_active);


--
-- TOC entry 4718 (class 1259 OID 25357)
-- Name: idx_services_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_services_provider_id ON public.services USING btree (provider_id);


--
-- TOC entry 4716 (class 1259 OID 25156)
-- Name: ix_admins_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_admins_id ON public.admins USING btree (id);


--
-- TOC entry 4697 (class 1259 OID 25012)
-- Name: ix_bookings_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_bookings_id ON public.bookings USING btree (id);


--
-- TOC entry 4702 (class 1259 OID 25029)
-- Name: ix_homeowners_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_homeowners_id ON public.homeowners USING btree (id);


--
-- TOC entry 4690 (class 1259 OID 24958)
-- Name: ix_provider_registration_requests_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_provider_registration_requests_id ON public.provider_registration_requests USING btree (id);


--
-- TOC entry 4703 (class 1259 OID 25060)
-- Name: ix_serviceproviders_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_serviceproviders_id ON public.serviceproviders USING btree (id);


--
-- TOC entry 4708 (class 1259 OID 25141)
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- TOC entry 4709 (class 1259 OID 25140)
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- TOC entry 4721 (class 2606 OID 25151)
-- Name: admins admins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4722 (class 2606 OID 25352)
-- Name: services fk_provider; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT fk_provider FOREIGN KEY (provider_id) REFERENCES public.serviceproviders(id);


-- Completed on 2025-04-26 09:58:28

--
-- PostgreSQL database dump complete
--

