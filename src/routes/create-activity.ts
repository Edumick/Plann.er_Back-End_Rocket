import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import {dayjs} from '../lib/dayjs';

export async function createActivity(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripid/activities',{
        schema:{
            params:z.object({
                tripid: z.string().uuid()
            }),
            body: z.object({
                title: z.string().min(4),
                occurs_at: z.coerce.date(),

            })
        }
    } ,async (request)=> {
        const {tripid } = request.params;
        const {title, occurs_at } = request.body;

        const trip = await prisma.trip.findUnique({
            where:{id: tripid}
        })

        if (!trip) {
            throw new Error('Trip not found')
        }


        if (dayjs(occurs_at).isBefore(trip.starts_at)) {
            throw new Error('Invalid activity date ocorre antes')
        }


        if (dayjs(occurs_at).isAfter(trip.ends_at)) {
            throw new Error('Invalid activity date ocorre depois')
        }

        const activity = await prisma.activity.create({
            data:{
                title, 
                occurs_at,
                trip_id: tripid,
            }
        })

        return { activityid: activity.id }
    })
}