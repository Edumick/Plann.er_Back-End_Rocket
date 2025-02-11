import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import {dayjs} from '../lib/dayjs';

export async function getTripDetails(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripid',{
        schema:{
            params:z.object({
                tripid: z.string().uuid()
            })
        }
    } ,async (request)=> {
        const {tripid } = request.params;

        const trip = await prisma.trip.findUnique({
            select:{
                id: true,
                destination: true,
                starts_at: true,
                ends_at: true,
                is_confirmed: true

            },
            where:{id: tripid},
        })

        if (!trip) {
            throw new Error('Trip not found')
        }

        return { trip}
    })
}