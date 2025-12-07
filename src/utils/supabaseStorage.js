import { supabase } from './firebase';

// Upload PDF file to Supabase Storage
export const uploadPDFToStorage = async (file, newspaperId) => {
  try {
    const fileName = `${newspaperId}/${file.name}`;
    const { data, error } = await supabase.storage
      .from('pdfs')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('pdfs')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

// Upload image to Supabase Storage
export const uploadImageToStorage = async (imageBlob, newspaperId, pageNumber) => {
  try {
    const fileName = `${newspaperId}/page-${pageNumber}.jpg`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, imageBlob, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Save newspaper to Supabase
export const saveNewspaperToSupabase = async (newspaper) => {
  try {
    const newspaperData = {
      name: newspaper.name,
      date: newspaper.date,
      total_pages: newspaper.totalPages,
      actual_pages: newspaper.actualPages,
      width: newspaper.width,
      height: newspaper.height,
      pages: newspaper.pages || [],
      preview_image: newspaper.previewImage,
      pdf_url: newspaper.pdfUrl,
      areas: newspaper.areas || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (newspaper.id && newspaper.id !== Date.now().toString()) {
      // Update existing
      const { data, error } = await supabase
        .from('newspapers')
        .update(newspaperData)
        .eq('id', newspaper.id)
        .select();
      
      if (error) throw error;
      return newspaper.id;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('newspapers')
        .insert([newspaperData])
        .select();
      
      if (error) throw error;
      return data[0].id;
    }
  } catch (error) {
    console.error('Error saving newspaper:', error);
    throw error;
  }
};

// Get all newspapers
export const getNewspapersFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('newspapers')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return data.map(newspaper => ({
      id: newspaper.id,
      name: newspaper.name,
      date: newspaper.date,
      totalPages: newspaper.total_pages,
      actualPages: newspaper.actual_pages,
      width: newspaper.width,
      height: newspaper.height,
      pages: newspaper.pages || [],
      previewImage: newspaper.preview_image,
      pdfUrl: newspaper.pdf_url,
      areas: newspaper.areas || []
    }));
  } catch (error) {
    console.error('Error getting newspapers:', error);
    throw error;
  }
};

// Get single newspaper
export const getNewspaperFromSupabase = async (id) => {
  try {
    const { data, error } = await supabase
      .from('newspapers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      date: data.date,
      totalPages: data.total_pages,
      actualPages: data.actual_pages,
      width: data.width,
      height: data.height,
      pages: data.pages || [],
      previewImage: data.preview_image,
      pdfUrl: data.pdf_url,
      areas: data.areas || []
    };
  } catch (error) {
    console.error('Error getting newspaper:', error);
    return null;
  }
};

// Update newspaper areas
export const updateNewspaperAreas = async (newspaperId, areas) => {
  try {
    const { error } = await supabase
      .from('newspapers')
      .update({ 
        areas: areas,
        updated_at: new Date().toISOString()
      })
      .eq('id', newspaperId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating areas:', error);
    throw error;
  }
};

// Get today's newspaper
export const getTodaysNewspaperFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('today_newspaper')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (data && data.newspaper_id) {
      return await getNewspaperFromSupabase(data.newspaper_id);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting today\'s newspaper:', error);
    return null;
  }
};

// Set today's newspaper
export const setTodaysNewspaperInSupabase = async (newspaperId) => {
  try {
    const { error } = await supabase
      .from('today_newspaper')
      .upsert({
        id: 1,
        newspaper_id: newspaperId,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting today\'s newspaper:', error);
    throw error;
  }
};

// Delete newspaper
export const deleteNewspaperFromSupabase = async (id) => {
  try {
    const { error } = await supabase
      .from('newspapers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting newspaper:', error);
    throw error;
  }
};