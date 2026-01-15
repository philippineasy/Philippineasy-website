import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: itineraryId } = await params;
    const body = await request.json();
    const { element_id, element_type, request_text } = body;

    if (!itineraryId || !element_id || !element_type || !request_text) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    const supabase = await createClientForRouteHandler();

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer l'itinéraire
    const { data: itinerary, error: itineraryError } = await supabase
      .from('itinerary_generations')
      .select('*')
      .eq('id', itineraryId)
      .single();

    if (itineraryError || !itinerary) {
      return NextResponse.json(
        { error: 'Itinéraire non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est propriétaire
    if (itinerary.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier le quota de modifications
    const modificationsRemaining = itinerary.modifications_remaining ?? 0;
    const isConciergerie = itinerary.offer_type === 'conciergerie';
    const isUnlimited = isConciergerie && modificationsRemaining === -1;

    if (!isUnlimited && modificationsRemaining <= 0) {
      return NextResponse.json(
        { error: 'Quota de modifications épuisé', modifications_remaining: 0 },
        { status: 403 }
      );
    }

    // Créer la demande de modification
    const { error: insertError } = await supabase
      .from('itinerary_modifications')
      .insert({
        itinerary_id: itineraryId,
        user_id: user.id,
        element_id,
        element_type,
        request_text,
        status: 'pending',
      });

    if (insertError) {
      console.error('Insert modification error:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      );
    }

    // Décrémenter le compteur si pas illimité
    let newModificationsRemaining = modificationsRemaining;
    if (!isUnlimited) {
      newModificationsRemaining = modificationsRemaining - 1;
      await supabase
        .from('itinerary_generations')
        .update({ modifications_remaining: newModificationsRemaining })
        .eq('id', itineraryId);
    }

    return NextResponse.json({
      success: true,
      modifications_remaining: isUnlimited ? -1 : newModificationsRemaining,
      message: 'Demande de modification enregistrée',
    });

  } catch (error) {
    console.error('Modification error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// GET pour récupérer les modifications d'un itinéraire
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: itineraryId } = await params;

    const supabase = await createClientForRouteHandler();

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer les modifications
    const { data: modifications, error } = await supabase
      .from('itinerary_modifications')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération' },
        { status: 500 }
      );
    }

    return NextResponse.json({ modifications: modifications || [] });

  } catch (error) {
    console.error('Get modifications error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
